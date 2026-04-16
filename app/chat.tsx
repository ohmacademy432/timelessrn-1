import { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import DrawerMenu from "@/components/DrawerMenu";
import BottomNav from "@/components/BottomNav";
import { colors, fonts } from "@/lib/theme";

type Msg = { role: "user" | "assistant"; content: string };

const API_URL = "/.netlify/functions/chat";

export default function ChatScreen() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Welcome to Timeless RN. I'm your wellness concierge — ask me anything about our IV therapies, PRP treatments, RF microneedling, memberships, or how to prepare for your visit." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Msg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const apiMessages = updated.filter((m) => m === userMsg || updated.indexOf(m) > 0).map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "I'm having trouble connecting. Please try again or text us at 615-970-2015." }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm having trouble connecting. Please try again or text us at 615-970-2015." }]);
    }
    setLoading(false);
  };

  return (
    <View style={s.container}>
      <StatusBar style="light" />
      <View style={s.header}>
        <TouchableOpacity style={s.back} onPress={() => router.back()}><Text style={s.backT}>{"\u2039"}</Text></TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>TIMELESS RN</Text>
          <Text style={s.headerSub}>Wellness Concierge</Text>
        </View>
        <TouchableOpacity style={s.menuBtn} onPress={() => setMenuOpen(true)}><View style={s.menuL} /><View style={s.menuL} /><View style={s.menuL} /></TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={0}>
        <ScrollView ref={scrollRef} style={s.chat} contentContainerStyle={s.chatC} showsVerticalScrollIndicator={false}>
          {messages.map((m, i) => (
            <View key={i} style={[s.bubble, m.role === "user" ? s.userBubble : s.aiBubble]}>
              {m.role === "assistant" && <Text style={s.aiLabel}>TIMELESS RN</Text>}
              <Text style={[s.msgText, m.role === "user" ? s.userText : s.aiText]}>{m.content}</Text>
            </View>
          ))}
          {loading && (
            <View style={[s.bubble, s.aiBubble]}>
              <Text style={s.aiLabel}>TIMELESS RN</Text>
              <ActivityIndicator size="small" color={colors.gold} style={{ alignSelf: "flex-start", marginTop: 4 }} />
            </View>
          )}
        </ScrollView>

        <View style={s.inputWrap}>
          <TextInput
            style={s.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about our services..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={500}
            onSubmitEditing={send}
            blurOnSubmit={false}
          />
          <TouchableOpacity style={[s.sendBtn, (!input.trim() || loading) && s.sendBtnOff]} onPress={send} disabled={!input.trim() || loading} activeOpacity={0.8}>
            <Text style={s.sendT}>{"\u2191"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <BottomNav onMenuPress={() => setMenuOpen(true)} />
      <DrawerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  flex: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 54, paddingBottom: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "rgba(184,137,90,0.15)" },
  back: { padding: 6 },
  backT: { fontSize: 36, color: colors.gold, lineHeight: 36 },
  headerCenter: { alignItems: "center" },
  headerTitle: { fontFamily: fonts.serifLight, fontSize: 22, color: colors.creamText, letterSpacing: 3 },
  headerSub: { fontFamily: fonts.serifLightItalic, fontSize: 14, color: colors.gold, letterSpacing: 2, marginTop: 2 },
  menuBtn: { padding: 6 },
  menuL: { width: 20, height: 1.5, backgroundColor: colors.gold, marginVertical: 2.5, borderRadius: 1 },
  chat: { flex: 1 },
  chatC: { padding: 20, paddingBottom: 10 },
  bubble: { marginBottom: 16, maxWidth: "85%", borderRadius: 12, padding: 14 },
  userBubble: { alignSelf: "flex-end", backgroundColor: colors.gold, borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: "flex-start", backgroundColor: "rgba(184,137,90,0.1)", borderWidth: 1, borderColor: "rgba(184,137,90,0.15)", borderBottomLeftRadius: 4 },
  aiLabel: { fontFamily: fonts.sans, fontSize: 11, color: colors.gold, letterSpacing: 3, marginBottom: 6, textTransform: "uppercase" },
  msgText: { fontFamily: fonts.sansLight, fontSize: 16, lineHeight: 24 },
  userText: { color: colors.ink },
  aiText: { color: "rgba(245,239,228,0.85)" },
  inputWrap: { flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: "rgba(184,137,90,0.15)", backgroundColor: colors.ink },
  input: { flex: 1, fontFamily: fonts.sansLight, fontSize: 16, color: colors.creamText, backgroundColor: "rgba(184,137,90,0.08)", borderWidth: 1, borderColor: "rgba(184,137,90,0.2)", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100, lineHeight: 22 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gold, justifyContent: "center", alignItems: "center", marginLeft: 10 },
  sendBtnOff: { opacity: 0.3 },
  sendT: { fontSize: 20, color: colors.ink, fontWeight: "700", lineHeight: 22 },
});
