import { ShowToast, ToastType } from "@/components/Toast";
import { useSSO } from "@clerk/expo";
import { useState } from "react";

function useSocialAuth(showToast: ShowToast) {
  const [loadingStrategy, setLoadingStrategy] = useState<
    "oauth_google" | "oauth_apple" | null
  >(null);

  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    if (loadingStrategy) return;

    setLoadingStrategy(strategy);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });

      if (!createdSessionId || !setActive) {
        const provider = strategy === "oauth_google" ? "Google" : "Apple";

        showToast(
          `${provider} sign in did not complete. Please try again.`,
          "warning",
        );

        return;
      }

      await setActive({
        session: createdSessionId,
      });
    } catch (error) {
      console.log(error);

      const provider = strategy === "oauth_google" ? "Google" : "Apple";

      showToast(
        `Failed to sign in with ${provider}. Please try again.`,
        "error",
      );
    } finally {
      setLoadingStrategy(null);
    }
  };

  return {
    handleSocialAuth,
    loadingStrategy,
  };
}

export default useSocialAuth;
