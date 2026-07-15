/**
 * API client configuration.
 *
 * - Creates a shared Axios instance for all backend requests.
 * - Automatically attaches the Clerk authentication token to protected requests.
 * - Logs failed API requests to Sentry for debugging and monitoring.
 * - Exposes both authenticated and unauthenticated request methods.
 */

import { useAuth } from "@clerk/expo";
import { useCallback } from "react";
import axios from "axios";
import * as Sentry from "@sentry/react-native";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_SITE_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Global response interceptor.
 *
 * Runs after every API request.
 * - Returns successful responses unchanged.
 * - Logs failed requests to Sentry with useful debugging information.
 * - Distinguishes between:
 *   - Server errors (received an error response)
 *   - Network errors (request sent but no response received)
 *   - Request/configuration errors (failed before the request was sent)
 * - Re-throws the error so React Query or the calling code can handle it.
 */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      Sentry.logger.error("API request failed", {
        status: error.response.status,
        endpoint: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        data: error.response.data,
      });
    } else if (error.request) {
      Sentry.logger.warn("API request failed - no response", {
        endpoint: error.config?.url,
        method: error.config?.method?.toUpperCase(),
      });
    } else {
      Sentry.logger.error("API request error", error.message);
    }

    return Promise.reject(error);
  },
);

export const useApi = () => {
  const { getToken } = useAuth();

  const apiWithAuth = useCallback(
    async <T>(config: Parameters<typeof api.request>[0]) => {
      const token = await getToken();

      return api.request<T>({
        ...config,
        headers: {
          ...config.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    },
    [getToken],
  );

  return {
    api,
    apiWithAuth,
  };
};
