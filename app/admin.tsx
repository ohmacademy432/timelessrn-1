import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Platform } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors, fonts } from "@/lib/theme";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "timelessrnwellnessspa@gmail.com";

const SERVICES = [
  "IV Hydration Therapy", "NAD+ Infusions", "Glutathione Therapy",
  "Vitamin C Infusions", "Custom IV Blend (Myers Cocktail)",
  "PRP Facial", "PRP Hair Growth", "PRP Joint Injection",
  "Radio Frequency Microneedling with PRP", "Wellness Add-Ons",
];

type Profile = { id: string; full_name: string | null; email?: string; phone?: string };
type Appointment = { id: string; service: string; appointment_date: string; notes: string; created_at: string };

function alert(title: string, msg: string) {
  if (Platform.OS === "web") window.alert(`${title}\n\n${msg}`);
  else { const { Alert } = require("react-native"); Alert.alert(title, msg); }
}

export default function AdminScreen() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Profile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email === ADMIN_EMAIL) {
      setAuthorized(true);
      loadProfiles();
    } else {
      setAuthorized(false);
    }
    setLoading(false);
  };

  const loadProfiles = async () => {
    const { data } = await supabase.from("profiles").select("id, full_name, phone").order("full_name");
    if (data) setProfiles(data);
  };

  const selectPatient = async (p: Profile) => {
    setSelected(p);
    setService("");
    setDate("");
    setNotes("");
    const { data } = await supabase.from("appointments").select("*").eq("profile_id", p.id).order("appointment_date", { ascending: false });
    setAppointments(data || []);
  };

  const logVisit = async () => {
    if (!selected || !service || !date) { alert("Missing info", "Please select a service and enter the date."); return; }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) { alert("Invalid date", "Use YYYY-MM-DD format (e.g. 2026-04-16)."); return; }
    setSaving(true);
    const { error } = await supabase.from("appointments").insert({ profile_id: selected.id, service, appointment_date: date, notes: notes.trim() });
    if (error) { alert("Error", error.message); }
    else {
      alert("Saved", `Visit logged for ${selected.full_name || "patient"}.`);
      setService("");
      setDate("");
      setNotes("");
      const { data } = await supabase.from("appointments").select("*").eq("profile_id", selected.id).order("appointment_date", { ascending: false });
      setAppointments(data || []);
    }
    setSaving(false);
  };

  const deleteAppt = async (id: string) => {
    if (Platform.OS === "web" && !window.confirm("Delete this appointment?")) return;
    await supabase.from("appointments").delete().eq("id", id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) return <View style={s.center}><StatusBar style="light" /><ActivityIndicator size="large" color={colors.gold} /></View>;
  if (!authorized) return (
    <View style={s.center}><StatusBar style="light" />
      <Text style={s.denied}>ACCESS RESTRICTED</Text>
      <Text style={s.deniedSub}>This area is for Timeless RN staff only.</Text>
      <TouchableOpacity onPress={() => router.back()} style={s.backBtn}><Text style={s.backBtnT}>GO BACK</Text></TouchableOpacity>
    </View>
  );

  const filtered = search.trim() ? profiles.filter((p) => (p.full_name || "").toLowerCase().includes(search.toLowerCase())) : profiles;

  return (
    <View style={s.container}><StatusBar style="light" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={s.backT}>{"\u2039"}</Text></TouchableOpacity>
        <Text style={s.headerTitle}>ADMIN PANEL</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollC}>
        {!selected ? (<>
          <Text style={s.secLbl}>SELECT PATIENT</Text>
          <TextInput style={s.searchInp} value={search} onChangeText={setSearch} placeholder="Search by name..." placeholderTextColor={colors.textMuted} />
          {filtered.map((p) => (
            <TouchableOpacity key={p.id} style={s.patientRow} onPress={() => selectPatient(p)} activeOpacity={0.8}>
              <Text style={s.patientName}>{p.full_name || "No name"}</Text>
              {p.phone ? <Text style={s.patientPhone}>{p.phone}</Text> : null}
            </TouchableOpacity>
          ))}
          {filtered.length === 0 && <Text style={s.empty}>No patients found.</Text>}
        </>) : (<>
          <TouchableOpacity onPress={() => setSelected(null)} style={s.changePat}><Text style={s.changePatT}>{"\u2039"} Change Patient</Text></TouchableOpacity>
          <Text style={s.patientSelected}>{selected.full_name || "Patient"}</Text>

          <Text style={s.secLbl}>LOG NEW VISIT</Text>
          <Text style={s.lbl}>SERVICE</Text>
          <View style={s.svcGrid}>
            {SERVICES.map((sv) => (
              <TouchableOpacity key={sv} style={[s.svcChip, service === sv && s.svcChipA]} onPress={() => setService(sv)} activeOpacity={0.8}>
                <Text style={[s.svcChipT, service === sv && s.svcChipTA]}>{sv}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={s.lbl}>DATE (YYYY-MM-DD)</Text>
          <TextInput style={s.inp} value={date} onChangeText={setDate} placeholder="2026-04-16" placeholderTextColor={colors.textMuted} />
          <Text style={s.lbl}>NOTES (OPTIONAL)</Text>
          <TextInput style={[s.inp, s.inpMulti]} value={notes} onChangeText={setNotes} placeholder="Session notes..." placeholderTextColor={colors.textMuted} multiline />
          <TouchableOpacity style={[s.saveBtn, saving && { opacity: 0.6 }]} onPress={logVisit} disabled={saving} activeOpacity={0.85}>
            {saving ? <ActivityIndicator color={colors.ink} /> : <Text style={s.saveBtnT}>LOG VISIT</Text>}
          </TouchableOpacity>

          <Text style={[s.secLbl, { marginTop: 36 }]}>PAST VISITS</Text>
          {appointments.length === 0 && <Text style={s.empty}>No visits recorded yet.</Text>}
          {appointments.map((a) => (
            <View key={a.id} style={s.apptCard}>
              <View style={s.apptTop}>
                <Text style={s.apptService}>{a.service}</Text>
                <TouchableOpacity onPress={() => deleteAppt(a.id)}><Text style={s.apptDel}>{"\u2715"}</Text></TouchableOpacity>
              </View>
              <Text style={s.apptDate}>{a.appointment_date}</Text>
              {a.notes ? <Text style={s.apptNotes}>{a.notes}</Text> : null}
            </View>
          ))}
        </>)}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  center: { flex: 1, backgroundColor: colors.ink, justifyContent: "center", alignItems: "center", padding: 24 },
  denied: { fontFamily: fonts.sans, fontSize: 18, color: colors.gold, letterSpacing: 4, textAlign: "center" },
  deniedSub: { fontFamily: fonts.sansLight, fontSize: 16, color: "rgba(245,239,228,0.6)", textAlign: "center", marginTop: 12 },
  backBtn: { marginTop: 24, borderWidth: 1, borderColor: colors.gold, borderRadius: 6, paddingVertical: 12, paddingHorizontal: 28 },
  backBtnT: { fontFamily: fonts.sansMedium, fontSize: 16, color: colors.gold, letterSpacing: 3 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 54, paddingBottom: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "rgba(184,137,90,0.15)" },
  backT: { fontSize: 36, color: colors.gold, lineHeight: 36 },
  headerTitle: { fontFamily: fonts.sans, fontSize: 16, color: colors.gold, letterSpacing: 4 },
  scroll: { flex: 1 },
  scrollC: { padding: 20, paddingBottom: 40 },
  secLbl: { fontFamily: fonts.sans, fontSize: 14, letterSpacing: 4, color: colors.gold, textTransform: "uppercase", marginBottom: 14, marginTop: 8 },
  searchInp: { fontFamily: fonts.sansLight, fontSize: 18, color: colors.creamText, borderBottomWidth: 1, borderBottomColor: "rgba(184,137,90,0.3)", paddingVertical: 12, marginBottom: 16, lineHeight: 24 },
  patientRow: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.04)" },
  patientName: { fontFamily: fonts.serifLight, fontSize: 22, color: colors.creamText },
  patientPhone: { fontFamily: fonts.sansLight, fontSize: 14, color: colors.textMuted, marginTop: 4 },
  empty: { fontFamily: fonts.sansLight, fontSize: 16, color: colors.textMuted, textAlign: "center", marginTop: 20 },
  changePat: { marginBottom: 8 },
  changePatT: { fontFamily: fonts.sansLight, fontSize: 16, color: colors.gold },
  patientSelected: { fontFamily: fonts.serifLight, fontSize: 32, color: colors.creamText, marginBottom: 20, letterSpacing: 1 },
  lbl: { fontFamily: fonts.sans, fontSize: 13, letterSpacing: 3, color: colors.gold, textTransform: "uppercase", marginBottom: 10, marginTop: 16 },
  svcGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  svcChip: { borderWidth: 1, borderColor: "rgba(184,137,90,0.3)", borderRadius: 6, paddingVertical: 10, paddingHorizontal: 14 },
  svcChipA: { backgroundColor: colors.gold, borderColor: colors.gold },
  svcChipT: { fontFamily: fonts.sansLight, fontSize: 14, color: colors.creamText },
  svcChipTA: { color: colors.ink },
  inp: { fontFamily: fonts.sansLight, fontSize: 18, color: colors.creamText, borderBottomWidth: 1, borderBottomColor: "rgba(184,137,90,0.3)", paddingVertical: 10, marginBottom: 8, lineHeight: 24 },
  inpMulti: { minHeight: 80, textAlignVertical: "top" },
  saveBtn: { backgroundColor: colors.gold, borderRadius: 8, paddingVertical: 16, alignItems: "center", marginTop: 24 },
  saveBtnT: { fontFamily: fonts.sansMedium, fontSize: 18, letterSpacing: 5, color: colors.ink, textTransform: "uppercase" },
  apptCard: { backgroundColor: "rgba(184,137,90,0.08)", borderWidth: 1, borderColor: "rgba(184,137,90,0.15)", borderRadius: 10, padding: 16, marginBottom: 12 },
  apptTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  apptService: { fontFamily: fonts.sansMedium, fontSize: 16, color: colors.creamText, letterSpacing: 1, flex: 1 },
  apptDel: { fontSize: 18, color: "rgba(184,137,90,0.4)", padding: 4 },
  apptDate: { fontFamily: fonts.sansLight, fontSize: 14, color: colors.gold, marginTop: 6, letterSpacing: 2 },
  apptNotes: { fontFamily: fonts.sansLight, fontSize: 14, color: "rgba(245,239,228,0.6)", marginTop: 8, lineHeight: 20 },
});
