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
  banner: {
    backgroundImage: 'url("../../assets/bannerImg.png")',
    backgroundPosition: "center",
    backgroundSize: "cover",
    height: "300px",
    position: "relative",
    backgroundColor: "purple.100",
    borderRadius: "10px",
    marginTop: "40px",
  },
  editButton: {
    position: "absolute",
    top: "5%",
    right: "1%",
    fontSize: "20px",
    backgroundColor: "brand.100",
    color: "white",
  },
  name: {
    fontSize: "4xl",
    fontWeight: "bold",
    marginLeft: "120px",
    marginTop: "20px",
    marginBottom: "10px",
  },
  connectionInfo: {
    marginLeft: "120px",
  },

  icon: {
    color: "brand.100",
    fontSize: "20px",
  },
  iconText: {
    fontSize: "20px",
  },

  profileBox: {
    position: "relative",
    w: "160px",
    h: "166px",
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
    // Add more styles here
  },
};

export default styles;
