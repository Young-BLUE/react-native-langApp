import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, TouchableOpacity } from "react-native";
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
  const Y = useRef(new Animated.Value(0)).current; // 4. useRef 를 통해 state 가 변경될 때 re-rendering 을 방지하고 값을 그대로 이용. (component의 lifeTime 동안 Object가 지속되도록 해준다)
  // 1. animation 만들고 싶은 value 는 state로 만들지 않는다.
  // 2. value를 직접 set 하지 않는다.
  // 3. Animatable Components 에만 animation을 줄 수 있다.
  // 3-1. 그러나 필요하다면 createAnimatedComponent 메소드를 통해 만들 수 있다.
  const moveUp = () => {
    Animated.timing(Y, {
      toValue: up ? 200 : -200,
      useNativeDriver: true, // bridge 사용 없이 native 로 애니메이션 정보를 보내게 된다 (Android, iOS)
    }).start(toggleUp); // React Component 에서 실행되지 않기 때문에 re-rendering 이 일어나지 않는다. 밖에서 console 찍어보면 Y 값은 그대로. addEventListener 하면 값 보임
  };

  return (
    <Container>
      <TouchableOpacity onPress={moveUp}>
        <AnimatedBox2
          style={{
            transform: [{ translateY: Y }],
          }}
        />
      </TouchableOpacity>
    </Container>
  );
}
