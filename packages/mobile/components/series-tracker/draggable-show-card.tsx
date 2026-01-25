import { Show } from "@/lib/types";
import { StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ShowCard } from "./show-card";

type Props = {
  show: Show;
  index: number;
  onReorder: (fromIndex: number, toIndex: number) => void;
};

export const DraggableShowCard = ({ show, index, onReorder }: Props) => {
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const handleGesture = (event: any) => {
    "worklet";
    if (event.nativeEvent.state === 1) {
      // BEGAN
      isDragging.value = true;
    } else if (event.nativeEvent.state === 2) {
      // ACTIVE
      translateY.value = event.nativeEvent.translationY;
    } else if (event.nativeEvent.state === 5) {
      // END
      isDragging.value = false;

      const translationY = event.nativeEvent.translationY;
      const threshold = 50;

      if (Math.abs(translationY) > threshold) {
        if (translationY < 0 && index > 0) {
          runOnJS(onReorder)(index, index - 1);
        } else if (translationY > 0) {
          runOnJS(onReorder)(index, index + 1);
        }
      }

      translateY.value = withSpring(0);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: isDragging.value ? 0.8 : 1,
    zIndex: isDragging.value ? 1000 : 1,
    elevation: isDragging.value ? 8 : 2,
  }));

  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <Animated.View style={[animatedStyle, styles.container]}>
        <ShowCard show={show} />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
});
