import LandingScreen from "@/src/components/LandingScreen";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/chat");
  }

  return <LandingScreen />;
}
