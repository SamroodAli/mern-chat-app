module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "320px",
    },
    extend: {
      height: {
        chat_mb: "40vh",
        chat_xs: "55vh",
        chat_sm: "60vh",
        chat_lg: "73vh",
      },
    },
  },
  plugins: [],
};
