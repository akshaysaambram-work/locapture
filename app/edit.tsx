import * as MediaLibrary from "expo-media-library";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { captureRef } from "react-native-view-shot";

export default function EditScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const viewRef = useRef<View>(null);
  const [saving, setSaving] = useState(false);

  const coords = "17.3850, 78.4867"; // replace with real data
  const timestamp = new Date().toLocaleString();

  const handleSave = async () => {
    try {
      setSaving(true);

      if (!viewRef.current) return;

      // Capture ONLY this composed view (image + overlay)
      const capturedUri = await captureRef(viewRef, {
        format: "jpg",
        quality: 1,
      });

      // Save final image
      await MediaLibrary.saveToLibraryAsync(capturedUri);

      router.back();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-black justify-center items-center">
      <View ref={viewRef} collapsable={false}>
        <Image
          source={{ uri }}
          style={{ width: 350, height: 500, borderRadius: 12 }}
        />

        <View className="absolute bottom-4 left-4 bg-black/50 px-3 py-2 rounded-lg">
          <Text className="text-white text-xs">{coords}</Text>
          <Text className="text-white text-xs">{timestamp}</Text>
        </View>
      </View>

      <Pressable
        onPress={handleSave}
        className="mt-6 bg-white px-6 py-3 rounded-xl"
      >
        <Text className="text-black font-medium">
          {saving ? "Saving..." : "Save Image"}
        </Text>
      </Pressable>
    </View>
  );
}
