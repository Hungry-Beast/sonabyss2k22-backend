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
  apiKey: "AIzaSyDzVhi7yNpTRqKuekOVlnKooaHkXpiMuUo",
  authDomain: "sonabyss-source.firebaseapp.com",
  projectId: "sonabyss-source",
  storageBucket: "sonabyss-source.appspot.com",
  messagingSenderId: "282489693070",
  appId: "1:282489693070:web:fd2b4b22f2d91d11b43adf",
  measurementId: "G-P813HZWBL9"
};
const app = initializeApp(firebaseConfig);

module.exports = app;
