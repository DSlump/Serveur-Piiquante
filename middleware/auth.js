const jwt = require("jsonwebtoken");
const jwtTokenKey = process.env.JWTTOKENKEY;

function authorizeUser(req, res, next) {
    try {
        const requestHeader = req.header("authorization");
        const token = requestHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, jwtTokenKey);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
          return res.status(403).json({ message: "Utilisateur invalide" });
        } else {
          next();
        }
      } catch {
        return res.status(401).json({ message: "Requête invalide" });
    }
}

module.exports = { authorizeUser };
