import React, { useEffect, useState } from "react";
import { Animated, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Box = styled.TouchableOpacity`
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

// 방법 2. 생성된 styled 객체를 Animated화
const AnimatedBox2 = Animated.createAnimatedComponent(Box);

export default function App() {
  // 1. animation 만들고 싶은 value 는 state로 만들지 않는다.
  const Y = new Animated.Value(0);
  // 2. value를 직접 set 하지 않는다.
  // 3. Animatable Components 에만 animation을 줄 수 있다.
  // 3-1. 그러나 필요하다면 createAnimatedComponent 메소드를 통해 만들 수 있다.
  const moveUp = () => {};

  return (
    <Container>
      <AnimatedBox2
        onPress={moveUp}
        style={{
          transform: [{ translateY: Y }],
        }}
      />
    </Container>
  );
}
