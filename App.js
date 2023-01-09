import React, { useRef } from "react";
import { Animated, PanResponder, View } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #00a8ff;
`;

const Card = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  width: 300px;
  height: 300px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
`;

export default function App() {
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const rotation = position.interpolate({
    inputRange: [-280, 280], // 한계치를 넘어서도 작동하는 문제가 있음
    outputRange: ["-10deg", "10deg"],
    extrapolate: "clamp", // 한계치를 넘었을 때 처리 명세 하는 부분 (extend, clamp...)
  });
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const onPressIn = Animated.spring(scale, {
    toValue: 0.95,
    useNativeDriver: true,
  });
  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, { dx }) => {
        console.log(dx);
        position.setValue(dx);
      },
      onPanResponderGrant: () => onPressIn.start(),
      onPanResponderRelease: (evt, { dx }) => {
        if (dx < -300) {
          Animated.spring(position, {
            toValue: -500,
            useNativeDriver: true,
          }).start();
        } else if (dx > 300) {
          Animated.spring(position, {
            toValue: 500,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
    })
  ).current;

  return (
    <Container>
      <Card
        {...panResponder.panHandlers}
        style={{
          transform: [
            { scale },
            { translateX: position },
            { rotateZ: rotation },
          ],
        }}
      >
        <Ionicons name={"pizza"} color={"#192a56"} size={98} />
      </Card>
    </Container>
  );
}
