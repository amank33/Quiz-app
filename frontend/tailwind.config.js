module.exports = {
    // content: [
    //   "./src/**/*.{html,js,jsx,ts,tsx}", // or your project's file extensions
    // ],
    // content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './src/**/*.{html,js,jsx,ts,tsx}',
      './index.html',
      
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };