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

  bannerImg: {
    w: "100%",
    h: "100%",
    borderRadius: 8,
    opacity: 0.6,
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
    fontSize: "2xl",
    fontWeight: "bold",
    marginTop: ["80px", "80px", "20px"],
    marginBottom: "10px",
  },
  connectionInfo: {},

  icon: {
    color: "brand.100",
    fontSize: "20px",
    // marginLeft: "20px",
  },
  iconText: {
    fontSize: "20px",
  },

  profileBox: {
    position: "relative",
    w: ["120px", "120px", "160px"],
    h: ["120px", "120px", "160px"],
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
  },

  profilePicFlexContainer: {
    justifyContent: "start",
    alignItems: "center",
    h: "0px",
    marginLeft: 5,
  },

  userProfileImg: {
    padding: "4px",
    bg: "brand.100",
    position: "absolute",
    top: "0",
  },

  connectionImg: {
    borderRadius: "full",
    boxSize: "40px",
    border: "1px solid",
    borderColor: "brand.100",
    alt: "Connection",
    marginRight: "-20px",
  },

  profileContainer: {
    gap: 8,
    margin: "50px 0",
  },

  connectedCompany: {
    borderRadius: "8px",
    padding: "30px",
    border: "1px solid",
    borderColor: "brand.200",
    order: 3,
  },
  connectedCompanyCard: {
    gap: 10,
    justifyItems: "start",
    alignItems: "start",
  },

  contactInfo: {
    gap: 6,
    alignItems: "start",
    borderRadius: "8px",
    padding: "20px",
    background: "brand.200",
    order: 2,
  },

  aboutBio: {
    alignItems: "start",
    borderRadius: "8px",
    padding: "20px",
    background: "brand.200",
    order: 1,
  },

  networkSuggestions: {
    borderRadius: "8px",
    padding: "30px",
    border: "1px solid",
    borderColor: "brand.200",
    order: 5,
  },

  aboutCompany: {
    order: 4,
    p: 4,
    borderRadius: "8px",
    padding: "30px",
    backgroundColor: "brand.200",
  },

  investmentGridCard: {
    spacing: 10,
    justifyItems: "start",
    alignItems: "start",
  },

  investmentContainer: {
    borderRadius: "8px",
    padding: "30px",
    border: "1px solid",
    borderColor: "brand.200",
    order: 6,
  },
};

export default styles;
