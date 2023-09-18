const styles = {
  profileCard: {
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  progressBar: {
    width: "100%",
  },
  button: {
    rounded: "none",
    w: "full",
    mt: 8,
    size: "lg",
    py: "7",
    bg: "brand.100",
    color: "white",
    textTransform: "uppercase",
    borderRadius: 8,
    _hover: {
      transform: "translateY(2px)",
      boxShadow: "lg",
      bg: "gray.700",
      color: "white",
    },
  },

  grid: {
    columns: { base: 1, lg: 1 },
    spacing: { base: 8, md: 10 },
    py: { base: 18, md: 10 },
    position: "relative",
  },

  banner: {
    fit: "cover",
    align: "center",
    w: "100%",
    h: { base: "200px", sm: "200px", lg: "300px" },
    opacity: ".5",
  },

  card: {
    position: { base: "static", md: "absolute" },
    width: "sm",
    margin: "auto",
    marginTop: ["-120px", "-120px", "0"],
    bg: "white",
    right: 8,
    top: "10%",
    border: "1px solid",
    borderColor: "brand.100",
    borderRadius: "12px",
    zIndex: 999,
  },
};

export default styles;
