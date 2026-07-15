import { User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "../lib/axios";

export const useAuthCallback = () => {
  const { apiWithAuth } = useApi();

  return useMutation({
    mutationFn: () =>
      apiWithAuth<User>({
        method: "POST",
        url: "/auth/callback",
      }),
  });
};

export const useCurrentUser = () => {
  const { apiWithAuth } = useApi();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () =>
      apiWithAuth<User>({
        method: "GET",
        url: "/auth/me",
      }),
  });
};
