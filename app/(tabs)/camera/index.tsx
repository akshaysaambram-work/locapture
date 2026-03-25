import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import * as Location from "expo-location";
import { router, useFocusEffect } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, StatusBar, Text, View } from "react-native";

export default function CameraScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<"back" | "front">("back");

  const [locationText, setLocationText] = useState("Fetching location...");
  const [metaInfo, setMetaInfo] = useState<string | null>(null);
  const [coords, setCoords] = useState<string | null>(null);

  const timestamp = new Date().toLocaleString();

  async function fetchLocation() {
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

        setMetaInfo(extras);
      } else {
        setLocationText("Unknown location");
      }
    } catch (e) {
      console.error(e);
      setLocationText("Location unavailable");
    }
  }

  useEffect(() => {
    fetchLocation();
  }, [locationText]);

  useFocusEffect(() => {
    fetchLocation();
  });

  async function takePhoto() {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 1,
    });
    if (!photo?.uri) return;

    router.push({
      pathname: "/camera/edit",
      params: { uri: photo.uri, locationText, metaInfo, coords },
    });
  }

  function toggleCamera() {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
        <View className="absolute top-14 left-4 right-4 bg-black/50 px-4 py-3 rounded-xl">
          <Text className="text-white text-xs font-medium">{locationText}</Text>
          <Text className="text-zinc-300 text-[10px] mt-1">{coords}</Text>
          <Text className="text-zinc-400 text-[10px] mt-1">{metaInfo}</Text>
          <Text className="text-zinc-500 text-[10px] mt-1">{timestamp}</Text>
        </View>

        <View className="absolute bottom-10 w-full flex-row items-center justify-between px-10">
          <Pressable onPress={toggleCamera}>
            <Ionicons name="camera-reverse" size={28} color="white" />
          </Pressable>
          <Pressable
            onPress={takePhoto}
            className="size-20 rounded-full border-4 border-white items-center justify-center"
          >
            <View className="size-14 bg-white rounded-full" />
          </Pressable>
          <View style={{ width: 28 }} />
        </View>
      </CameraView>
    </View>
  );
}
