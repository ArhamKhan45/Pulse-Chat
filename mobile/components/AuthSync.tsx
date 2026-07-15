import { useAuthCallback } from "@/hook/useAuth";
import { useAuth, useUser } from "@clerk/expo";
import { useEffect, useRef } from "react";
import * as Sentry from "@sentry/react-native";

const AuthSync = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { mutate: syncUser } = useAuthCallback();

  // Prevent running the sync more than once per sign-in
  const hasSynced = useRef(false);

  useEffect(() => {
    if (isSignedIn && user && !hasSynced.current) {
      hasSynced.current = true;

      syncUser(undefined, {
        onSuccess: ({ data }) => {
          console.log("✅ User synced with backend:", data.name);
          Sentry.logger.info(
            Sentry.logger.fmt`User synced with backend: ${data.name}`,
            {
              userId: user.id,
              userName: data.name,
            },
          );
        },
        onError: (error) => {
          console.log("❌ User sync failed for the user:", error);
          Sentry.logger.error("Failed to sync user with backend", {
            userId: user.id,
            error: error instanceof Error ? error.message : String(error),
          });
        },
      });
    }

    // Reset when the user signs out
    if (!isSignedIn) {
      hasSynced.current = false;
    }
  }, [isSignedIn, user, syncUser]);

  return null;
};

export default AuthSync;
