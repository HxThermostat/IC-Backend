import React from "react";

import Box, { BoxProps } from "~/components/Box";

interface BadgeableProps {
  visible: boolean;
  children: React.ReactNode | React.ReactNode[];
}

export const Badge = (props: BoxProps): JSX.Element => (
  <Box
    backgroundColor="badge"
    position="absolute"
    top={-2}
    right={-2}
    height={8}
    width={8}
    borderRadius={4}
    {...props}
  />
);

const Badgeable = ({ visible, children }: BadgeableProps): JSX.Element => {
  return (
    <Box>
      {children}
      {visible && <Badge />}
    </Box>
  );
};

export default Badgeable;
