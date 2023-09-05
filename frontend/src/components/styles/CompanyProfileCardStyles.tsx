import { keyframes } from "@emotion/react";
const pulseRing = keyframes`
0% {
transform: scale(0.33);
}
40%,
50% {
opacity: 0;
}
100% {
opacity: 0;
}
`;

const styles = {
  profileCard: {
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  profileBox: {
    position: "relative",
    w: "96px",
    h: "96px",
    _before: {
      content: "''",
      position: "relative",
      display: "block",
      width: "300%",
      height: "300%",
      boxSizing: "border-box",
      marginLeft: "-100%",
      marginTop: "-100%",
      borderRadius: "50%",
      bgColor: "brand.100",
      animation: `2.25s ${pulseRing} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
    },
    marginTop: "-90px",
  },
  progressBar: {
    width: "100%",
    bg: "brand.200",
    marginTop: "10px",
    borderRadius: "10px",
  },
  logo: {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "50px",
    height: "50px",
  },
  investmentGroup: {
    width: "100%",
    borderColor: "brand.100",
  },
  icon: {
    color: "brand.100",
    fontSize: "20px",
  },
};

export default styles;
