import { Linking, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { BOOKING_URL } from "./theme";

export async function openBooking(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      Linking.openURL(BOOKING_URL);
      return;
    }
    await WebBrowser.openBrowserAsync(BOOKING_URL);
  } catch (e) {
    console.log("[Booking] Open error:", e);
    Linking.openURL(BOOKING_URL).catch(() => {});
  }
}
