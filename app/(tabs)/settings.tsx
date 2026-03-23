import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  View,
} from "react-native";

function openSettings() {
  Linking.openSettings();
}

export default function SettingsScreen() {
  const [showCoords, setShowCoords] = useState(true);
  const [showAddress, setShowAddress] = useState(true);
  const [showTimestamp, setShowTimestamp] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);

  return (
    <View className="flex-1 bg-black px-5 pt-14">
      <StatusBar barStyle="light-content" />

      <Text className="text-white text-2xl font-semibold mb-6">Settings</Text>
      <ScrollView className="flex-1">
        {/* <View className="mb-8">
          <Text className="text-zinc-400 text-xs mb-3">OVERLAY</Text>

          <SettingItem
            label="Show Coordinates"
            value={showCoords}
            onChange={setShowCoords}
          />
          <SettingItem
            label="Show Address"
            value={showAddress}
            onChange={setShowAddress}
          />
          <SettingItem
            label="Show Timestamp"
            value={showTimestamp}
            onChange={setShowTimestamp}
          />
        </View>
        <View className="mb-8">
          <Text className="text-zinc-400 text-xs mb-3">LOCATION</Text>

          <SettingItem
            label="High Accuracy GPS"
            value={highAccuracy}
            onChange={setHighAccuracy}
            description="Better accuracy, more battery usage"
          />
        </View> */}
        <View className="mb-8">
          <Text className="text-zinc-400 text-xs mb-2">PERMISSIONS</Text>

          <Pressable
            onPress={openSettings}
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
            <Text className="text-zinc-500 text-xs mt-1">1.0.0</Text>
          </View>
        </View>

        <View className="pt-36 pb-12">
          <Text className="text-zinc-500 text-4xl uppercase tracking-widest">
            Capture moments with location 📍
          </Text>
          <View className="h-px border my-4 border-gray-800" />
          <Text className="text-zinc-600 text-xl">Locapture</Text>
        </View>
      </ScrollView>
    </View>
  );
}

type SettingItemProps = {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  description?: string;
};

function SettingItem({
  label,
  value,
  onChange,
  description,
}: Readonly<SettingItemProps>) {
  return (
    <View className="py-4 border-b border-zinc-800">
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-sm">{label}</Text>
        <Switch value={value} onValueChange={onChange} />
      </View>

      {!!description && (
        <Text className="text-zinc-500 text-xs">{description}</Text>
      )}
    </View>
  );
}
