const { initializeApp } = require("firebase/app");
const firebaseConfig = {
  apiKey: "AIzaSyAk4qHvsek3gMw7nxopRREsNQf0X1m9Dbg",
  authDomain: "sonabyss-48665.firebaseapp.com",
  projectId: "sonabyss-48665",
  storageBucket: "sonabyss-48665.appspot.com",
  messagingSenderId: "861460162966",
  appId: "1:861460162966:web:1471f632c6d25955a6d5b7",
  measurementId: "G-X970LKE227",
};
const app = initializeApp(firebaseConfig);

module.exports = app;
