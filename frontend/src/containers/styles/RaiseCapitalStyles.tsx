import { useBreakpointValue } from "@chakra-ui/react";

const styles = {
  heroStack: {
    minH: "600px",
    background: "brand.100",
  },

  heroFlex: {
    p: 8,
    flex: 1,
    align: "center",
    justify: "center",
  },

  heroHeading: {
    _after: {
      content: "",
      width: "70%",
      height: useBreakpointValue({ base: "20%", md: "30%" }),
      position: "absolute",
      bottom: 1,
      right: 0,
      bg: "brand.100",
      zIndex: -1,
    },
  },
};

export default styles;
