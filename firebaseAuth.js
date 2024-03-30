const { initializeApp } = require("firebase/app");
// const firebaseConfig = {
//   apiKey: "AIzaSyAk4qHvsek3gMw7nxopRREsNQf0X1m9Dbg",
//   authDomain: "sonabyss-48665.firebaseapp.com",
//   projectId: "sonabyss-48665",
//   storageBucket: "sonabyss-48665.appspot.com",
//   messagingSenderId: "861460162966",
//   appId: "1:861460162966:web:1471f632c6d25955a6d5b7",
//   measurementId: "G-X970LKE227",
// };
const firebaseConfig = {
  apiKey: "AIzaSyALoTvcKEB2jUGBo3lVlJT9Sd0ZwbBkYRw",
  authDomain: "sristhi-e1145.firebaseapp.com",
  projectId: "sristhi-e1145",
  storageBucket: "sristhi-e1145.appspot.com",
  messagingSenderId: "451467819952",
  appId: "1:451467819952:web:69114f3ef8a01a81f57475",
  measurementId: "G-VDBMJBN93R"
};
const app = initializeApp(firebaseConfig);

module.exports = app;
