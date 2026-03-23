import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { captureRef } from "react-native-view-shot";

export default function EditScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const viewRef = useRef<View>(null);

  const [saving, setSaving] = useState(false);
  const [locationText, setLocationText] = useState("Fetching location...");
  const [metaInfo, setMetaInfo] = useState<string | null>(null);
  const [coords, setCoords] = useState<string | null>(null);

  const timestamp = new Date().toLocaleString();

  useEffect(() => {
    (async () => {
      try {
        // Get high accuracy location
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude, altitude, accuracy, speed, heading } =
          loc.coords;

        // Format coords
        setCoords(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);

        // Reverse geocode
        const address = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (address.length > 0) {
          const a = address[0];

          // Build rich location string
          const formatted = [
            a.name, // place name
            a.street, // street
            a.district, // district (Android mostly)
            a.subregion, // subregion
            a.city, // city
            a.region, // state
            a.postalCode, // ZIP / PIN
            a.country, // country
          ]
            .filter(Boolean)
            .join(", ");

          setLocationText(formatted);

          // Extra metadata (optional display)
          const extras = [
            altitude ? `Alt: ${altitude.toFixed(1)}m` : null,
            accuracy ? `±${accuracy.toFixed(1)}m` : null,
            speed ? `Speed: ${(speed * 3.6).toFixed(1)} km/h` : null,
            heading ? `Heading: ${heading.toFixed(0)}°` : null,
          ]
            .filter(Boolean)
            .join(" • ");

          setMetaInfo(extras); // <- create this state
        } else {
          setLocationText("Unknown location");
        }
      } catch (e) {
        console.error(e);
        setLocationText("Location unavailable");
      }
    })();
  }, []);

  const captureImage = async () => {
    if (!viewRef.current) return null;

    return await captureRef(viewRef, {
      format: "jpg",
      quality: 1,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const capturedUri = await captureImage();
      if (!capturedUri) return;

      await MediaLibrary.saveToLibraryAsync(capturedUri);
      router.back();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      const capturedUri = await captureImage();
      if (!capturedUri) return;

      await Sharing.shareAsync(capturedUri);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 items-center justify-center gap-4">
        <View ref={viewRef} collapsable={false}>
          <Image
            source={{ uri }}
            style={{ width: 360, height: 520, borderRadius: 16 }}
          />

          <View className="absolute bottom-4 left-4 right-4 bg-black/50 px-4 py-3 rounded-xl">
            <Text className="text-white text-xs font-medium">
              {locationText}
            </Text>
            <Text className="text-zinc-300 text-[10px] mt-1">{coords}</Text>
            {metaInfo && (
              <Text className="text-zinc-400 text-[10px] mt-1">{metaInfo}</Text>
            )}
            <Text className="text-zinc-500 text-[10px] mt-1">{timestamp}</Text>
          </View>
        </View>

        <View className="w-full flex-row items-center justify-between px-4 bg-black border-zinc-800">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <View className="flex-row gap-2">
            <Pressable
              onPress={handleShare}
              className="bg-zinc-800 px-5 py-3 rounded-xl flex-row items-center gap-2"
            >
              <Ionicons name="share-outline" size={18} color="white" />
              <Text className="text-white text-sm">Share</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              className="bg-white px-6 py-3 rounded-xl flex-row items-center gap-2"
            >
              {saving ? (
                <ActivityIndicator />
              ) : (
                <>
                  <Ionicons name="download-outline" size={18} color="black" />
                  <Text className="text-black text-sm font-medium">Save</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
