// const config = {
//   API_URL:
//     process.env.NODE_ENV === "production"
//       ? "https://finance-hive.onrender.com"
//       : "http://localhost:5000",
// };

// export default config;


const config = {
  API_URL: process.env.REACT_APP_API_URL || "https://finance-hive.onrender.com"
};

export default config;