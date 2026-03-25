import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import {
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-black px-5 pt-14">
      <StatusBar barStyle="light-content" />

      <Text className="text-white text-2xl font-semibold mb-6">Settings</Text>
      <ScrollView className="flex-1">
        <View className="mb-8">
          <Text className="text-zinc-400 text-xs mb-2">PERMISSIONS</Text>

          <Pressable
            onPress={() => Linking.openSettings()}
            className="flex-row items-center bg-zinc-800/45 justify-between p-4 rounded-xl border-zinc-800"
          >
            <Text className="text-white text-sm">Open App Settings</Text>
            <Ionicons name="open-outline" size={18} color="white" />
          </Pressable>
        </View>
        <View>
          <Text className="text-zinc-400 text-xs mb-2">ABOUT</Text>

          <View className="p-4 rounded-xl bg-zinc-800/45 border-zinc-800">
            <Text className="text-white text-sm">App Version</Text>
            <Text className="text-zinc-500 text-xs mt-1">
              {Constants.expoConfig?.version ?? "—"}
            </Text>
          </View>
        </View>

        <View className="pt-36 pb-12">
          <Text className="text-zinc-500 text-4xl uppercase tracking-widest">
            Capture moments with location 📍
          </Text>
          <View className="h-px my-4 bg-zinc-800" />
          <Text className="text-zinc-600 text-xl">Locapture</Text>
        </View>
      </ScrollView>
    </View>
  );
}
