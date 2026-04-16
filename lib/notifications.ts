import { Platform } from "react-native";
import { supabase } from "./supabase";
import { DAILY_TIPS, getDailyTip } from "./tips";

const isWeb = Platform.OS === "web";

let Notifications: any = null;

if (!isWeb) {
  Notifications = require("expo-notifications");
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// ─── Web notification helpers ───

let webTimerId: ReturnType<typeof setInterval> | null = null;

function webNotificationsSupported(): boolean {
  return isWeb && typeof window !== "undefined" && "Notification" in window;
}

async function requestWebPermission(): Promise<boolean> {
  if (!webNotificationsSupported()) return false;
  const perm = await window.Notification.requestPermission();
  return perm === "granted";
}

function showWebNotification(title: string, body: string) {
  if (!webNotificationsSupported()) return;
  if (window.Notification.permission === "granted") {
    new window.Notification(title, { body, icon: "/assets/images/icon.png" });
  }
}

function scheduleWebDaily(timeStr: string) {
  if (webTimerId) clearInterval(webTimerId);
  const [hours, minutes] = timeStr.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return;

  webTimerId = setInterval(() => {
    const now = new Date();
    if (now.getHours() === hours && now.getMinutes() === minutes) {
      const tip = getDailyTip();
      showWebNotification("TIMELESS RN", tip);
    }
  }, 60_000);
}

function cancelWebDaily() {
  if (webTimerId) { clearInterval(webTimerId); webTimerId = null; }
}

// ─── Permissions ───

export async function requestNotificationPermission(): Promise<boolean> {
  if (isWeb) return requestWebPermission();
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let status = existing;
    if (status !== "granted") {
      const { status: req } = await Notifications.requestPermissionsAsync();
      status = req;
    }
    return status === "granted";
  } catch (e) {
    console.log("[Notifications] Permission error:", e);
    return false;
  }
}

// ─── Schedule daily ───

const CHANNEL_ID = "timelessrn-daily";

export async function scheduleDaily(timeStr: string): Promise<void> {
  if (isWeb) { scheduleWebDaily(timeStr); return; }

  const [hours, minutes] = timeStr.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Daily Wellness Reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: "#C4956A",
    });
  }

  for (let i = 0; i < 7; i++) {
    const body = DAILY_TIPS[i];
    await Notifications.scheduleNotificationAsync({
      content: { title: "TIMELESS RN", body, sound: "default" },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: i + 1,
        hour: hours,
        minute: minutes,
        channelId: CHANNEL_ID,
      } as any,
    });
  }
  console.log("[Notifications] Scheduled 7 daily reminders at", timeStr);
}

export async function cancelAll(): Promise<void> {
  if (isWeb) { cancelWebDaily(); return; }
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// ─── Enable / disable ───

export async function enableNotifications(
  userId: string,
  time: string = "08:00"
): Promise<boolean> {
  const granted = await requestNotificationPermission();
  if (!granted) return false;

  await scheduleDaily(time);

  await supabase
    .from("profiles")
    .update({ notifications_enabled: true, notification_time: time })
    .eq("id", userId);

  return true;
}

export async function disableNotifications(userId: string): Promise<void> {
  await cancelAll();
  await supabase
    .from("profiles")
    .update({ notifications_enabled: false })
    .eq("id", userId);
}

// ─── Init on app load ───

export async function initNotifications(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("notifications_enabled, notification_time")
      .eq("id", user.id)
      .single();
    if (profile?.notifications_enabled) {
      const granted = await requestNotificationPermission();
      if (granted) await scheduleDaily(profile.notification_time || "08:00");
    }
  } catch (e) {
    console.log("[Notifications] Init error:", e);
  }
}

export { getDailyTip };
