import { Stack } from "expo-router";
import { ScrollView, Text, View } from "react-native";

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
      </ScrollView>
    </>
  );
}
