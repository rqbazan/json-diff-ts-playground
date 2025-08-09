import { chakra } from "@chakra-ui/react";
import { isValidMotionProp, motion } from "motion/react";

export const AnimatedBox = chakra(
  motion.div,
  {},
  {
    shouldForwardProp: isValidMotionProp,
  },
);
