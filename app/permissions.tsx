import * as Camera from "expo-camera";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";

export default function PermissionsScreen() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [, requestCameraPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    async function checkPermissions() {
      try {
        const camera = await requestCameraPermission();
        const location = await Location.getForegroundPermissionsAsync();

        const allGranted =
          camera.status === "granted" && location.status === "granted";

        if (allGranted) router.replace("/camera");
      } catch (e) {
        console.error(e);
      } finally {
        setChecking(false);
      }
    }

    checkPermissions();
  }, [requestCameraPermission]);

  async function requestPermissions() {
    try {
      setLoading(true);

      // Camera
      const camera = await requestCameraPermission();

      // Location
      const location = await Location.requestForegroundPermissionsAsync();

      const allGranted =
        camera.status === "granted" && location.status === "granted";

      if (allGranted) {
        router.replace("/camera"); // navigate to camera screen
      } else {
        Alert.alert("Please grant all permissions to continue.");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Something went wrong while requesting permissions.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <StatusBar barStyle="light-content" />

      <Text className="text-white text-2xl font-semibold text-center">
        Permissions Required
      </Text>
      <Text className="text-zinc-400 text-center mt-3 leading-5">
        Locapture needs access to your camera, location, and storage to capture
        and save photos with location data.
      </Text>

      <Pressable
        onPress={requestPermissions}
        disabled={loading}
        className="mt-8 bg-white py-4 rounded-2xl items-center"
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text className="text-black font-medium">Allow Permissions</Text>
        )}
      </Pressable>

      <Text className="text-zinc-600 text-xs text-center mt-4">
        You can change permissions anytime in settings
      </Text>
    </View>
  );
}
