import { useAuth } from "@clerk/expo";
import { Stack } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function Index() {
  const { signOut } = useAuth();
  return (
    <>
      <Stack.Screen
        options={{
          title: "Profile",
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="bg-surface"
      >
        <Text className="text-yellow-500">
          <Pressable
            onPress={() => {
              signOut();
            }}
          >
            <Text className="text-red-500">Signout</Text>
          </Pressable>
        </Text>
      </ScrollView>
    </>
  );
}
