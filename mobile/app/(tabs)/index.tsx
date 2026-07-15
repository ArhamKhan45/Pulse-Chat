import * as Sentry from "@sentry/react-native";
import { Stack } from "expo-router";
import { Button, ScrollView, Text, View } from "react-native";

export default function Chats() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Chats",
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="bg-surface"
      >
        <Text className="text-yellow-500">Chat</Text>
        <Button
          title="Try!"
          onPress={() => {
            console.log("running");
            Sentry.captureException(new Error("Second error"));
          }}
        />
      </ScrollView>
    </>
  );
}
