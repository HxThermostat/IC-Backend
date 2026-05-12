import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

const sharedAnimationConfig = {
  isInteraction: false,
  useNativeDriver: true,
};

export const useGlowPulseAnimation = (
  min: number,
  max: number,
  duration: number,
  active: boolean
): React.MutableRefObject<Animated.Value> => {
  const glowAnimScale = useRef(new Animated.Value(min));

  const ease = Easing.poly(2);

  duration = duration / 2;

  const animationRef = useRef(
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimScale?.current, {
          toValue: max,
          duration,
          ...sharedAnimationConfig,
          easing: Easing.inOut(ease),
        }),
        Animated.timing(glowAnimScale?.current, {
          toValue: min,
          duration,
          ...sharedAnimationConfig,
          easing: Easing.inOut(ease),
        }),
      ])
    )
  );

  useEffect(() => {
    if (active) {
      animationRef.current.start();
    } else {
      animationRef.current.reset();
      glowAnimScale?.current.setValue(1);
    }
  }, [active, min, max, duration]);

  return glowAnimScale;
};
