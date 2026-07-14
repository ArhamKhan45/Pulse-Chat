import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const AuthLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  return isSignedIn ? (
    <Redirect href={"/(tabs)"} />
  ) : (
    <Stack screenOptions={{ headerShown: false }} />
  );
};

export default AuthLayout;
