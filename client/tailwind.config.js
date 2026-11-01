module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 700: "#142B57", 900: "#0B1B3A" },
        accent: { 500: "#F5A623", 600: "#DB8F0E" },
        muted: "#F3F5F8",
        ink: { DEFAULT: "#1F2937", soft: "#5B6472" },
        line: "#E2E6EC",
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: { card: "12px" },
      boxShadow: { card: "0 4px 20px rgba(11,27,58,0.08)" },
    },
  },
  plugins: [],
};
