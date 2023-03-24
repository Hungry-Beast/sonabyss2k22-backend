//creating a middleware "fetchuser" for validation of the user wherever login is required. This acts as a function so that we don't have to repeat the same code again and again
const jwt = require("jsonwebtoken");

const JWT_SECRET = "hippu";
const fetchuser = (req, res, next) => {

  // console.log("Hi")
  // get the user from the jwt token and add to the req object
  const bearerToken = req.header("Authorization");
  const token = bearerToken.split(" ")[1];

  if (!token) {
    //in case of invalid token
    res.status(401).send({ error: "Please authenticate using a valid token!" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET); //verify and get the user
    req.user = data.user;
    // console.log(data.user)
    next();
    // The next() function is not a part of the Node.js or Express API but is the third argument that is passed to the middleware function. This means that the async (req, res) will be called after getting the user in the ‘getuser’ route.
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token!" });
  }
};
module.exports = fetchuser;
