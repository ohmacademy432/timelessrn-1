import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { supabase } from "./supabase";
import { DAILY_TIPS, getDailyTip } from "./tips";

// ─── Handler ───
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ─── Permissions ───

export async function requestNotificationPermission(): Promise<boolean> {
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
  const [hours, minutes] = timeStr.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return;

  // Cancel any existing schedules
  await Notifications.cancelAllScheduledNotificationsAsync();

  // On Android we need a channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Daily Wellness Reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: "#C4956A",
    });
  }

  // Schedule all 7 weekday reminders (weekday: 1=Sun..7=Sat in expo-notifications)
  // JS Date.getDay(): 0=Sun..6=Sat, so JS index + 1 == expo weekday
  for (let i = 0; i < 7; i++) {
    const body = DAILY_TIPS[i];
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "TIMELESS RN",
        body,
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: i + 1,
        hour: hours,
        minute: minutes,
        channelId: CHANNEL_ID,
      } as Notifications.WeeklyTriggerInput,
    });
  }
  console.log("[Notifications] Scheduled 7 daily reminders at", timeStr);
}

export async function cancelAll(): Promise<void> {
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
