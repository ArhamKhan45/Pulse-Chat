import React, { useState } from "react";
import {
  Text,
  View,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import Toast from "@/components/Toast";
import useSocialAuth from "@/hook/useSocialAuth";

const { width, height } = Dimensions.get("window");

type ToastType = "success" | "error" | "info" | "warning";

const AuthScreen = () => {
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "info" as ToastType,
  });

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({
      visible: true,
      message,
      type,
    });
  };

  const { handleSocialAuth, loadingStrategy } = useSocialAuth(showToast);

  const isLoading = loadingStrategy !== null;

  return (
    <View className="flex-1 bg-surface-dark">
      <SafeAreaView className="flex-1">
        {/* Logo */}
        <View className="items-center pt-3">
          <Image
            source={require("../../assets/main-images/logo.png")}
            style={{
              width: 80,
              height: 80,
              marginVertical: -20,
            }}
            contentFit="contain"
          />

          <Text className="text-4xl font-bold text-primary font-serif tracking-wider uppercase mt-6">
            Pulse
          </Text>
        </View>

        {/* Hero */}
        <View className="flex-1 justify-center items-center px-6">
          <Image
            source={require("../../assets/main-images/dark-auth.png")}
            style={{
              width: width - 26,
              height: height * 0.4,
            }}
            contentFit="contain"
          />

          <View className="mt-6 items-center">
            <Text className="text-5xl font-bold text-foreground text-center font-sans">
              Stay Connected,
            </Text>

            <Text className="text-3xl font-bold text-primary font-mono">
              Anytime, Anywhere.
            </Text>
          </View>

          {/* Buttons */}
          <View className="flex-row gap-4 mt-10">
            {/* Google */}
            <Pressable
              className="flex-1 flex-row items-center justify-center gap-2 bg-white/95 py-4 rounded-2xl active:scale-[0.97]"
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
              onPress={() => !isLoading && handleSocialAuth("oauth_google")}
            >
              {loadingStrategy === "oauth_google" ? (
                <ActivityIndicator size="small" color="#1A1A1A" />
              ) : (
                <>
                  <Image
                    source={require("../../assets/main-images/google.png")}
                    style={{
                      width: 20,
                      height: 20,
                    }}
                    contentFit="contain"
                  />

                  <Text className="text-gray-900 font-semibold text-sm">
                    Google
                  </Text>
                </>
              )}
            </Pressable>

            {/* Apple */}
            <Pressable
              className="flex-1 flex-row items-center justify-center gap-2 bg-white/10 py-4 rounded-2xl border border-white/20 active:scale-[0.97]"
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Continue with Apple"
              onPress={() => !isLoading && handleSocialAuth("oauth_apple")}
            >
              {loadingStrategy === "oauth_apple" ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="logo-apple" size={20} color="#FFFFFF" />

                  <Text className="text-foreground font-semibold text-sm">
                    Apple
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
        <Toast
          isVisible={toast.visible}
          message={toast.message}
          duration={150}
          type={toast.type}
          onHide={() =>
            setToast((prev) => ({
              ...prev,
              visible: false,
            }))
          }
        />
      </SafeAreaView>
    </View>
  );
};

export default AuthScreen;
