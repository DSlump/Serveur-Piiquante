const User = require("../models/User");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtTokenKey = process.env.JWTTOKENKEY;

async function createUser(req, res) {
    try {
        const isValidEmail = emailValidator.validate(req.body.email);
        if (!isValidEmail) {
            res.status(400).json({
                message: "Le format de l'email est incorrect",
            });
        }
        const { email, password } = req.body;

        const hashedPassword = await hashPassword(password);

        const user = new User({ email: email, password: hashedPassword });

        await user.save();
        res.status(201).json({ message: "Utilisateur enregistré" });
    } catch {
        res.status(401).json({ message: "Utilisateur deja enregistré" });
    }
}

function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

async function logUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const dataBaseUser = await User.findOne({ email: email });
    if (!dataBaseUser) {
        res.status(401).json({ message: "Utilisateur inconnu" });
    }
    const passwordCheck = await bcrypt.compare(password, dataBaseUser.password);

    if (!passwordCheck) {
        res.status(403).json({ message: "Invalid password" });
    }
    const token = createToken(email);
    res.status(200).json({ userId: dataBaseUser?._id, token: token });
}

function createToken(email) {
    const token = jwt.sign({ email: email }, jwtTokenKey, { expiresIn: "172h" });
    return token;
}

module.exports = { createUser, logUser };
