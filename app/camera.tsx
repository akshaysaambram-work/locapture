import { View, Text, Pressable, StatusBar } from "react-native";
import { useEffect, useRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

export default function CameraScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      if (!hasPermission?.granted) {
        await requestPermission();
      }

      const locPerm = await Location.getForegroundPermissionsAsync();
      if (locPerm.status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    })();
  }, []);

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 1,
    });

    // Save to gallery
    await MediaLibrary.saveToLibraryAsync(photo.uri);
  };

  const toggleCamera = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  if (!hasPermission) return null;

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
        <View className="absolute top-14 left-4 right-4">
          <View className="bg-black/40 px-4 py-2 rounded-xl">
            <Text className="text-white text-xs">
              {location
                ? `${location.coords.latitude.toFixed(5)}, ${location.coords.longitude.toFixed(5)}`
                : "Fetching location..."}
            </Text>
            <Text className="text-white text-xs">
              {new Date().toLocaleString()}
            </Text>
          </View>
        </View>

        <View className="absolute bottom-10 w-full flex-row items-center justify-between px-10">
          <Pressable onPress={toggleCamera}>
            <Ionicons name="camera-reverse" size={28} color="white" />
          </Pressable>
          <Pressable
            onPress={takePhoto}
            className="w-20 h-20 rounded-full border-4 border-white items-center justify-center"
          >
            <View className="w-14 h-14 bg-white rounded-full" />
          </Pressable>
          <View style={{ width: 28 }} />
        </View>
      </CameraView>
    </View>
  );
}
