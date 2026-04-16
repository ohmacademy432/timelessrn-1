import { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Platform } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors, fonts } from "@/lib/theme";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "timelessrnwellnessspa@gmail.com";

type Contact = { id: string; name: string; email: string; phone: string; source: string };

function notify(t: string, msg: string) {
  if (Platform.OS === "web") window.alert(`${t}\n\n${msg}`);
  else { const { Alert } = require("react-native"); Alert.alert(t, msg); }
}

export default function ContactsScreen() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [importing, setImporting] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === ADMIN_EMAIL) { setAuthorized(true); loadContacts(); }
      else setAuthorized(false);
      setLoading(false);
    })();
  }, []);

  const loadContacts = async () => {
    const { data } = await supabase.from("contacts").select("*").order("name");
    setContacts(data || []);
  };

  const importSquare = async () => {
    setImporting(true);
    try {
      const res = await fetch("/.netlify/functions/square-contacts", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const data = await res.json();
      if (!data.contacts) { notify("Error", data.error || "Failed to fetch from Square."); setImporting(false); return; }
      let added = 0;
      for (const c of data.contacts) {
        const { error } = await supabase.from("contacts").upsert({ name: c.name, email: c.email, phone: c.phone, source: "square" }, { onConflict: "email", ignoreDuplicates: true });
        if (!error) added++;
      }
      await loadContacts();
      notify("Square Import", `Fetched ${data.count} contacts. ${added} new/updated.`);
    } catch { notify("Error", "Could not connect to Square."); }
    setImporting(false);
  };

  const handleFileDrop = useCallback((e: any) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const text = ev.target?.result as string;
        if (!text) return;
        const ext = file.name.toLowerCase();
        let parsed: { name: string; email: string; phone: string }[] = [];
        if (ext.endsWith(".vcf") || ext.endsWith(".vcard")) {
          parsed = parseVCard(text);
        } else if (ext.endsWith(".csv") || ext.endsWith(".txt")) {
          parsed = parseCSV(text);
        } else {
          notify("Unsupported file", "Please drop a .csv, .txt, or .vcf file.");
          return;
        }
        let added = 0;
        for (const c of parsed) {
          if (!c.email && !c.phone) continue;
          const { error } = await supabase.from("contacts").upsert({ name: c.name, email: c.email, phone: c.phone, source: "import" }, { onConflict: "email", ignoreDuplicates: true });
          if (!error) added++;
        }
        await loadContacts();
        notify("File Import", `Parsed ${parsed.length} contacts from ${file.name}. ${added} new/updated.`);
      };
      reader.readAsText(file);
    });
  }, []);

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];
    const header = lines[0].toLowerCase().split(",").map(h => h.trim().replace(/"/g, ""));
    const nameIdx = header.findIndex(h => h.includes("name"));
    const fnIdx = header.findIndex(h => h.includes("first"));
    const lnIdx = header.findIndex(h => h.includes("last"));
    const emailIdx = header.findIndex(h => h.includes("email") || h.includes("e-mail"));
    const phoneIdx = header.findIndex(h => h.includes("phone") || h.includes("mobile") || h.includes("cell"));
    return lines.slice(1).map(line => {
      const cols = line.split(",").map(c => c.trim().replace(/^"|"$/g, ""));
      let name = nameIdx >= 0 ? cols[nameIdx] || "" : "";
      if (!name && fnIdx >= 0) name = [cols[fnIdx], lnIdx >= 0 ? cols[lnIdx] : ""].filter(Boolean).join(" ");
      return { name: name || "Unknown", email: emailIdx >= 0 ? cols[emailIdx] || "" : "", phone: phoneIdx >= 0 ? cols[phoneIdx] || "" : "" };
    });
  };

  const parseVCard = (text: string) => {
    const cards = text.split("BEGIN:VCARD").filter(Boolean);
    return cards.map(card => {
      const lines = card.split(/\r?\n/);
      let name = "", email = "", phone = "";
      for (const l of lines) {
        if (l.startsWith("FN:") || l.startsWith("FN;")) name = l.split(":").slice(1).join(":").trim();
        if (l.startsWith("EMAIL") && !email) email = l.split(":").slice(1).join(":").trim();
        if (l.startsWith("TEL") && !phone) phone = l.split(":").slice(1).join(":").trim();
      }
      return { name: name || "Unknown", email, phone };
    }).filter(c => c.email || c.phone);
  };

  const addManual = async () => {
    if (!addEmail && !addPhone) { notify("Missing info", "Enter an email or phone number."); return; }
    const { error } = await supabase.from("contacts").upsert({ name: addName.trim() || "Unknown", email: addEmail.trim(), phone: addPhone.trim(), source: "manual" }, { onConflict: "email", ignoreDuplicates: true });
    if (error) notify("Error", error.message);
    else { setAddName(""); setAddEmail(""); setAddPhone(""); setShowAdd(false); loadContacts(); }
  };

  const deleteContact = async (id: string) => {
    if (Platform.OS === "web" && !window.confirm("Remove this contact?")) return;
    await supabase.from("contacts").delete().eq("id", id);
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const copyEmails = () => {
    const emails = contacts.map(c => c.email).filter(Boolean);
    if (emails.length === 0) { notify("No emails", "No email addresses to copy."); return; }
    if (Platform.OS === "web" && navigator.clipboard) {
      navigator.clipboard.writeText(emails.join(", ")).then(() => notify("Copied!", `${emails.length} email addresses copied to clipboard.`));
    }
  };

  const copyPhones = () => {
    const phones = contacts.map(c => c.phone).filter(Boolean);
    if (phones.length === 0) { notify("No phones", "No phone numbers to copy."); return; }
    if (Platform.OS === "web" && navigator.clipboard) {
      navigator.clipboard.writeText(phones.join(", ")).then(() => notify("Copied!", `${phones.length} phone numbers copied to clipboard.`));
    }
  };

  const filtered = search.trim() ? contacts.filter(c => [c.name, c.email, c.phone].join(" ").toLowerCase().includes(search.toLowerCase())) : contacts;
  const emailCount = contacts.filter(c => c.email).length;
  const phoneCount = contacts.filter(c => c.phone).length;

  if (loading) return <View style={s.center}><StatusBar style="light" /><ActivityIndicator size="large" color={colors.gold} /></View>;
  if (!authorized) return (
    <View style={s.center}><StatusBar style="light" />
      <Text style={s.denied}>ACCESS RESTRICTED</Text>
      <Text style={s.deniedSub}>This area is for Timeless RN staff only.</Text>
      <TouchableOpacity onPress={() => router.back()} style={s.backNavBtn}><Text style={s.backNavBtnT}>GO BACK</Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={s.container}
      {...(Platform.OS === "web" ? {
        onDragOver: (e: any) => { e.preventDefault(); setDragOver(true); },
        onDragLeave: () => setDragOver(false),
        onDrop: handleFileDrop,
      } : {})}
    >
      <StatusBar style="light" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={s.backT}>{"\u2039"}</Text></TouchableOpacity>
        <Text style={s.headerTitle}>CONTACTS</Text>
        <View style={{ width: 30 }} />
      </View>

      {dragOver && <View style={s.dropOverlay}><Text style={s.dropText}>DROP FILE TO IMPORT</Text></View>}

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollC}>
        {/* Stats */}
        <View style={s.statsRow}>
          <View style={s.statBox}><Text style={s.statNum}>{contacts.length}</Text><Text style={s.statLbl}>TOTAL</Text></View>
          <View style={s.statBox}><Text style={s.statNum}>{emailCount}</Text><Text style={s.statLbl}>EMAILS</Text></View>
          <View style={s.statBox}><Text style={s.statNum}>{phoneCount}</Text><Text style={s.statLbl}>PHONES</Text></View>
        </View>

        {/* Actions */}
        <View style={s.actions}>
          <TouchableOpacity style={s.actionBtn} onPress={importSquare} disabled={importing} activeOpacity={0.85}>
            {importing ? <ActivityIndicator color={colors.ink} /> : <Text style={s.actionBtnT}>IMPORT FROM SQUARE</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={s.actionBtnAlt} onPress={() => setShowAdd(!showAdd)} activeOpacity={0.85}>
            <Text style={s.actionBtnAltT}>{showAdd ? "CANCEL" : "ADD CONTACT"}</Text>
          </TouchableOpacity>
        </View>

        {/* Manual add form */}
        {showAdd && <View style={s.addForm}>
          <TextInput style={s.inp} value={addName} onChangeText={setAddName} placeholder="Name" placeholderTextColor={colors.textMuted} />
          <TextInput style={s.inp} value={addEmail} onChangeText={setAddEmail} placeholder="Email" placeholderTextColor={colors.textMuted} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={s.inp} value={addPhone} onChangeText={setAddPhone} placeholder="Phone" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" />
          <TouchableOpacity style={s.actionBtn} onPress={addManual} activeOpacity={0.85}><Text style={s.actionBtnT}>SAVE</Text></TouchableOpacity>
        </View>}

        {/* Copy buttons */}
        <View style={s.copyRow}>
          <TouchableOpacity style={s.copyBtn} onPress={copyEmails} activeOpacity={0.85}><Text style={s.copyBtnT}>COPY ALL EMAILS</Text></TouchableOpacity>
          <TouchableOpacity style={s.copyBtn} onPress={copyPhones} activeOpacity={0.85}><Text style={s.copyBtnT}>COPY ALL PHONES</Text></TouchableOpacity>
        </View>

        {/* File drop hint */}
        <View style={s.dropHint}><Text style={s.dropHintT}>Drag & drop a .csv or .vcf file anywhere on this page to import</Text></View>

        {/* Search */}
        <TextInput style={s.searchInp} value={search} onChangeText={setSearch} placeholder="Search contacts..." placeholderTextColor={colors.textMuted} />

        {/* Contact list */}
        {filtered.map(c => (
          <View key={c.id} style={s.contactRow}>
            <View style={s.contactInfo}>
              <Text style={s.contactName}>{c.name}</Text>
              {c.email ? <Text style={s.contactDetail}>{c.email}</Text> : null}
              {c.phone ? <Text style={s.contactDetail}>{c.phone}</Text> : null}
              <Text style={s.contactSource}>{c.source.toUpperCase()}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteContact(c.id)}><Text style={s.contactDel}>{"\u2715"}</Text></TouchableOpacity>
          </View>
        ))}
        {filtered.length === 0 && <Text style={s.empty}>{contacts.length === 0 ? "No contacts yet. Import from Square or add manually." : "No results found."}</Text>}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  center: { flex: 1, backgroundColor: colors.ink, justifyContent: "center", alignItems: "center", padding: 24 },
  denied: { fontFamily: fonts.sans, fontSize: 18, color: colors.gold, letterSpacing: 4, textAlign: "center" },
  deniedSub: { fontFamily: fonts.sansLight, fontSize: 16, color: "rgba(245,239,228,0.6)", textAlign: "center", marginTop: 12 },
  backNavBtn: { marginTop: 24, borderWidth: 1, borderColor: colors.gold, borderRadius: 6, paddingVertical: 12, paddingHorizontal: 28 },
  backNavBtnT: { fontFamily: fonts.sansMedium, fontSize: 16, color: colors.gold, letterSpacing: 3 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 54, paddingBottom: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "rgba(184,137,90,0.15)" },
  backT: { fontSize: 36, color: colors.gold, lineHeight: 36 },
  headerTitle: { fontFamily: fonts.sans, fontSize: 16, color: colors.gold, letterSpacing: 4 },
  scroll: { flex: 1 },
  scrollC: { padding: 20, paddingBottom: 40 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: "rgba(184,137,90,0.08)", borderWidth: 1, borderColor: "rgba(184,137,90,0.15)", borderRadius: 10, padding: 16, alignItems: "center" },
  statNum: { fontFamily: fonts.serifLight, fontSize: 32, color: colors.creamText },
  statLbl: { fontFamily: fonts.sans, fontSize: 11, color: colors.gold, letterSpacing: 3, marginTop: 4 },
  actions: { flexDirection: "row", gap: 10, marginBottom: 16 },
  actionBtn: { flex: 1, backgroundColor: colors.gold, borderRadius: 8, paddingVertical: 14, alignItems: "center" },
  actionBtnT: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.ink, letterSpacing: 3, textTransform: "uppercase" },
  actionBtnAlt: { flex: 1, borderWidth: 1, borderColor: colors.gold, borderRadius: 8, paddingVertical: 14, alignItems: "center" },
  actionBtnAltT: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.gold, letterSpacing: 3, textTransform: "uppercase" },
  addForm: { backgroundColor: "rgba(184,137,90,0.06)", borderWidth: 1, borderColor: "rgba(184,137,90,0.15)", borderRadius: 10, padding: 16, marginBottom: 16, gap: 8 },
  inp: { fontFamily: fonts.sansLight, fontSize: 16, color: colors.creamText, borderBottomWidth: 1, borderBottomColor: "rgba(184,137,90,0.25)", paddingVertical: 10, lineHeight: 22 },
  copyRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  copyBtn: { flex: 1, borderWidth: 1, borderColor: "rgba(184,137,90,0.4)", borderRadius: 8, paddingVertical: 12, alignItems: "center" },
  copyBtnT: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.gold, letterSpacing: 2, textTransform: "uppercase" },
  dropHint: { backgroundColor: "rgba(184,137,90,0.04)", borderWidth: 1, borderColor: "rgba(184,137,90,0.1)", borderRadius: 8, padding: 12, marginBottom: 16, borderStyle: "dashed" },
  dropHintT: { fontFamily: fonts.sansLight, fontSize: 14, color: colors.textMuted, textAlign: "center" },
  dropOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, backgroundColor: "rgba(184,137,90,0.15)", justifyContent: "center", alignItems: "center" },
  dropText: { fontFamily: fonts.sans, fontSize: 24, color: colors.gold, letterSpacing: 6 },
  searchInp: { fontFamily: fonts.sansLight, fontSize: 16, color: colors.creamText, borderBottomWidth: 1, borderBottomColor: "rgba(184,137,90,0.25)", paddingVertical: 10, marginBottom: 16, lineHeight: 22 },
  contactRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.04)" },
  contactInfo: { flex: 1 },
  contactName: { fontFamily: fonts.serifLight, fontSize: 20, color: colors.creamText },
  contactDetail: { fontFamily: fonts.sansLight, fontSize: 14, color: "rgba(245,239,228,0.7)", marginTop: 2 },
  contactSource: { fontFamily: fonts.sans, fontSize: 10, color: colors.textMuted, letterSpacing: 2, marginTop: 4 },
  contactDel: { fontSize: 16, color: "rgba(184,137,90,0.3)", padding: 8 },
  empty: { fontFamily: fonts.sansLight, fontSize: 16, color: colors.textMuted, textAlign: "center", marginTop: 30 },
});
