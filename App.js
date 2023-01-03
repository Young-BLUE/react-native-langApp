import React, { useEffect, useState } from "react";
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

export default function App() {
  const [y, setY] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [way, setWay] = useState(false);
  const moveUp = () => {
    if (!way) {
      setIntervalId(setInterval(() => setY((prev) => prev + 5), 10));
    } else {
      setIntervalId(setInterval(() => setY((prev) => prev - 5), 10));
    }
  };
  useEffect(() => {
    if (!way && y === 200) {
      clearInterval(intervalId);
      setWay(!way);
    } else if (way && y === 0) {
      clearInterval(intervalId);
      setWay(!way);
    }
  }, [y, intervalId]);
  return (
    <Container>
      <Box
        onPress={moveUp}
        style={{
          transform: [{ translateY: y }],
        }}
      />
    </Container>
  );
}
