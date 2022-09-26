const { user } = require("./mongo");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtTokenKey = process.env.JWTTOKENKEY;

async function createUser(req, res) {
    try {
        const isValidEmail = emailValidator.validate(req.body.email);
        if (!isValidEmail) {
            res.status(400).send({
                message: "Le format de l'email est incorrect",
            });
        }
        const { email, password } = req.body;

        const hashedPassword = await hashPassword(password);

        const newUser = new user({ email: email, password: hashedPassword });

        await newUser.save();
        res.status(201).send({ message: "Utilisateur enregistré" });
    } catch {
        res.status(401).send({ message: "Utilisateur deja enregistré" });
    }
}

function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

async function logUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const isUserHere = await user.findOne({ email: email });
    if (!isUserHere) {
        res.status(401).send({ message: "Utilisateur inconnu" });
    }
    const passwordCheck = await bcrypt.compare(password, isUserHere.password);

    if (!passwordCheck) {
        res.status(403).send({ message: "Invalid password" });
    }
    const token = createToken(email);
    res.status(200).send({ userId: isUserHere?._id, token: token });
}

function createToken(email) {
    const token = jwt.sign({ email: email }, jwtTokenKey, { expiresIn: "172h" });
    return token;
}

module.exports = {createUser, logUser};
