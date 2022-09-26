const jwt = require("jsonwebtoken");
const jwtTokenKey = process.env.JWTTOKENKEY;

function authentificateUser(req, res, next) {
    try {
    const requestHeader = req.header("authorization");
    const token = requestHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, jwtTokenKey);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
        return res.status(403).send({ message: "Invalid User" });
      } else {
        next();
      }
    } catch {
        res.status(401).send({ message: "Invalid request" });
    }
}

module.exports = { authentificateUser };
