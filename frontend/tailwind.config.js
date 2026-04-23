module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0C14",
        mist: "#F5F7FB",
        accent: "#7CF0C8",
        gold: "#E4C48B",
        coral: "#FF8E7C"
      },
      boxShadow: {
        glow: "0 20px 80px rgba(124, 240, 200, 0.18)",
        panel: "0 16px 60px rgba(10, 12, 20, 0.16)"
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at top, rgba(124,240,200,0.22), transparent 38%), radial-gradient(circle at 80% 20%, rgba(228,196,139,0.18), transparent 30%), linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))"
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        shine: "shine 7s linear infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        shine: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" }
        }
      }
    }
  },
  plugins: []
};
