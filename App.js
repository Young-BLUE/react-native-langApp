import React, { useRef, useState } from "react";
import { Animated, Easing, PanResponder, View } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import icons from "./icons";

const BLACK_COLOR = "#1e272e";
const GREY = "#485460";
const GREEN = "#2ecc71";
const RED = "#e74c3c";

const Wrapper = styled.View`
  flex: 1;
  background-color: ${BLACK_COLOR};
`;
const Container = styled.View`
  flex: 1;
  margin-top: 20px;
`;
const Edge = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  //background-color: ${RED};
`;
const WordContainer = styled(Animated.createAnimatedComponent(View))`
  width: 150px;
  height: 100px;
  justify-content: center;
  align-items: center;
  background-color: ${GREY};
  border-radius: 50px;
`;
const Word = styled.Text`
  font-size: 38px;
  font-weight: 500;
  color: ${(props) => props.color};
`;
const Center = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const IconCard = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  padding: 10px 20px;
  border-radius: 10px;
`;

export default function App() {
  // Values
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scaleOne = position.y.interpolate({
    inputRange: [-300, -80],
    outputRange: [1.3, 1],
    extrapolate: "clamp",
  });
  const scaleTwo = position.y.interpolate({
    inputRange: [80, 300],
    outputRange: [1, 1.3],
    extrapolate: "clamp",
  });
  // Animations
  const onPressIn = Animated.spring(scale, {
    toValue: 0.9,
    useNativeDriver: true,
  });
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const goHome = Animated.spring(position, {
    toValue: 0,
    tension: 10,
    useNativeDriver: true,
  });
  const onDropScale = Animated.timing(scale, {
    toValue: 0,
    useNativeDriver: true,
    duration: 50,
    easing: Easing.linear,
  });
  const onDropOpacity = Animated.timing(opacity, {
    toValue: 0,
    duration: 50,
    easing: Easing.linear,
    useNativeDriver: true,
  });
  // PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, // 손가락 움직임 감지
      onPanResponderMove: (evt, { dx, dy }) => {
        position.setValue({ x: dx, y: dy });
      },
      onPanResponderGrant: () => {
        onPressIn.start();
      },
      onPanResponderRelease: (e, { dy }) => {
        if (dy < -250 || dy > 250) {
          Animated.sequence([
            Animated.parallel([onDropOpacity, onDropScale]),
            Animated.timing(position, {
              toValue: 0,
              duration: 50,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]).start();
        } else {
          Animated.parallel([onPressOut, goHome]).start();
        }
      },
    })
  ).current;

  // State

  return (
    <Wrapper>
      <Container>
        <Edge>
          <WordContainer
            style={{
              transform: [{ scale: scaleOne }],
            }}
          >
            <Word color={GREEN}>내 안다</Word>
          </WordContainer>
        </Edge>
        <Center>
          <IconCard
            {...panResponder.panHandlers}
            style={{
              opacity,
              transform: [...position.getTranslateTransform(), { scale }],
            }}
          >
            <Ionicons name={"beer"} color={GREY} size={80} />
          </IconCard>
        </Center>
        <Edge>
          <WordContainer
            style={{
              transform: [{ scale: scaleTwo }],
            }}
          >
            <Word color={RED}>내 모른다</Word>
          </WordContainer>
        </Edge>
      </Container>
    </Wrapper>
  );
}
