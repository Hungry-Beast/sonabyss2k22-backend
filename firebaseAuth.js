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
  apiKey: "AIzaSyBV8q7HhfcXdBvNwRZ6AX1Wn80XOUN5Ipc",
  authDomain: "srishti-8f23d.firebaseapp.com",
  projectId: "srishti-8f23d",
  storageBucket: "srishti-8f23d.appspot.com",
  messagingSenderId: "898270969259",
  appId: "1:898270969259:web:20c570b4f7e9b5f39d66ee",
  measurementId: "G-R8T4NHPYTV"
};
const app = initializeApp(firebaseConfig);

module.exports = app;
