import { router } from "expo-router";
import { useEffect } from "react";
import { StatusBar, Text, View } from "react-native";

export default function Index() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/permissions");
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <StatusBar barStyle="light-content" />

      <View className="items-center">
        <Text className="text-white text-3xl font-semibold tracking-wide">
          Locapture
        </Text>
        <Text className="text-zinc-400 text-sm mt-2">
          Capture moments with location 📍
        </Text>
      </View>
      <View className="absolute bottom-16">
        <Text className="text-zinc-600 text-xs">Powered by Arox Playworks</Text>
      </View>
    </View>
  );
}
