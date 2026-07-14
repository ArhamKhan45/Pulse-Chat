import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS } from "@/constants/colors";

export type ToastType = "success" | "error" | "info" | "warning";
export type ShowToast = (message: string, type?: ToastType) => void;

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 3000,
  onHide,
  isVisible,
}) => {
  const insets = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const getStatusColor = () => {
    switch (type) {
      case "success":
        return COLORS.success;

      case "error":
        return COLORS.error;

      case "warning":
        return COLORS.warning;

      default:
        return COLORS.primary;
    }
  };

  useEffect(() => {
    if (!isVisible) return;

    Animated.sequence([
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 80,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(duration),

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onHide?.();
    });
  }, [isVisible, duration]);

  if (!isVisible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          top: insets.top + 12,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View
        style={[
          styles.toast,
          {
            backgroundColor: COLORS.card,
            borderColor: COLORS.border,
            shadowColor: COLORS.primary,
          },
        ]}
      >
        <View
          style={[
            styles.dot,
            {
              backgroundColor: getStatusColor(),
            },
          ]}
        />

        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 99999,
    elevation: 99999,
  },

  toast: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 18,
    paddingVertical: 14,

    borderRadius: 16,
    borderWidth: 1,

    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: 12,
  },

  text: {
    flex: 1,
    color: COLORS.foreground,
    fontSize: 15,
    fontWeight: "600",
  },
});

export default Toast;
