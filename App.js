import React, { useRef } from "react";
import { Animated, TouchableOpacity, PanResponder } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

//const Box = styled.TouchableOpacity`
const Box = styled.View`
  background-color: tomato;
  width: 200px;
  height: 200px;
`;

// 방법 1. styled 로 Animated화 시킨 TouchableOpacity를 생성
const AnimatedBox1 = styled(Animated.createAnimatedComponent(TouchableOpacity))`
  background-color: tomato;
  width: 200px;
  height: 200px;
`;

// 방법 2. 생성된 styled 객체를 Animated화 (TouchableOpacity를 Animated, 지금은 View로 바꾼상태)
const AnimatedBox2 = Animated.createAnimatedComponent(Box);

export default function App() {
  const POSITION = useRef(
    new Animated.ValueXY({
      x: 0,
      y: 0,
    })
  ).current;
  const borderRadius = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: [100, 0],
  });
  const bgColor = POSITION.y.interpolate({
    // native 에서 backgroundColor 를 animate 할 수 없기 때문에 false 로 두어야 한다.
    inputRange: [-300, 300],
    outputRange: ["rgb(255, 99, 71)", "rgb(71, 155, 255)"],
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, // 입력 해줘야 event 감지해서 움직일 수 있음
      onPanResponderMove: (evt, { dx, dy }) => {
        POSITION.setValue({
          x: dx,
          y: dy,
        });
      },
    })
  ).current;

  return (
    <Container>
      <AnimatedBox2
        {...panResponder.panHandlers}
        style={{
          borderRadius,
          backgroundColor: bgColor,
          transform: [...POSITION.getTranslateTransform()],
        }}
      />
    </Container>
  );
}
