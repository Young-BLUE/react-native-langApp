import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, TouchableOpacity } from "react-native";
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
  const [up, setUp] = useState(false);
  const toggleUp = () => setUp((prev) => !prev);
  const POSITION = useRef(new Animated.ValueXY({ x: 0, y: 300 })).current; // 4. useRef 를 통해 state 가 변경될 때 re-rendering 을 방지하고 값을 그대로 이용. (component의 lifeTime 동안 Object가 지속되도록 해준다)
  // 1. animation 만들고 싶은 value 는 state로 만들지 않는다.
  // 2. value를 직접 set 하지 않는다.
  // 3. Animatable Components 에만 animation을 줄 수 있다.
  // 3-1. 그러나 필요하다면 createAnimatedComponent 메소드를 통해 만들 수 있다.
  const moveUp = () => {
    Animated.timing(POSITION, {
      toValue: up ? 300 : -300,
      useNativeDriver: false, // bridge 사용 없이 native 로 애니메이션 정보를 보내게 된다 (Android, iOS)
      duration: 1000,
    }).start(toggleUp); // React Component 에서 실행되지 않기 때문에 re-rendering 이 일어나지 않는다. 밖에서 console 찍어보면 POSITION 값은 그대로. addEventListener 하면 값 보임
  };
  const rotation = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: ["-360deg", "360deg"],
  });

  const borderRadius = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: [100, 0],
  });
  // POSITION.addListener(() => {
  //   console.log("Y VALUE: ", POSITION);
  //   console.log("borderRadius VALUE: ", borderRadius);
  // });
  const bgColor = POSITION.y.interpolate({
    // native 에서 backgroundColor 를 animate 할 수 없기 때문에 false 로 두어야 한다.
    inputRange: [-300, 300],
    outputRange: ["rgb(255, 99, 71)", "rgb(71, 155, 255)"],
  });

  POSITION.addListener(() => console.log(POSITION.getTranslateTransform()));
  return (
    <Container>
      <Pressable onPress={moveUp}>
        <AnimatedBox2
          style={{
            borderRadius,
            backgroundColor: bgColor,
            transform: [
              { rotateY: rotation },
              ...POSITION.getTranslateTransform(),
            ],
          }}
        />
      </Pressable>
    </Container>
  );
}
