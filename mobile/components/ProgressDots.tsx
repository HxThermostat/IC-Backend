import React from "react";

import Box, { Row } from "~/components/Box";

interface ProgressDotsProps {
  dots: number;
  activeIndex: number;
}

const ProgressDots = (props: ProgressDotsProps): JSX.Element => {
  const { dots, activeIndex } = props;

  return (
    <Box
      alignItems="center"
      flexDirection="row"
      justifyContent="center"
      paddingVertical="l"
    >
      <Row alignItems="center" justifyContent="center">
        {Array.from(Array(dots).keys()).map((_, i) => (
          <Box
            width={7}
            height={7}
            backgroundColor="text"
            borderRadius={3.5}
            opacity={i === activeIndex ? 1 : 0.5}
            key={i}
            marginHorizontal="xs"
          />
        ))}
      </Row>
    </Box>
  );
};

export default ProgressDots;
