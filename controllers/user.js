const User = require("../models/User");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createUser(req, res) {
    try {
        const isValidEmail = emailValidator.validate(req.body.email);
        if (!isValidEmail) {
            return res.status(400).json({ message: "Le format de l'email est incorrect" });
        }
        bcrypt
            .hash(req.body.password, 10)
            .then((hash) => {
                const user = new User({
                    email: req.body.email,
                    password: hash,
                });
                user
                    .save()
                    .then(() => res.status(201).json({ message: "Utilisateur créé" }))
                    .catch(() => {
                        return res.status(400).json({ message: "Utilisateur deja créé" });
                    });
            })
    }
    catch {
        return res.status(500).json({ error });
    }
}

async function logUser(req, res) {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: "Utilisateur inconnu" });
        }
        bcrypt
            .compare(req.body.password, user.password)
            .then((validPassword) => {
                if (!validPassword) {
                    return res.status(401).json({ message: "Mot de passe incorrect" });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign({ userId: user._id }, process.env.JWTTOKENKEY, {
                        expiresIn: "168h",
                    }),
                });
            })
    } catch {
        return res.status(500).json({ error });
    }
}

module.exports = { createUser, logUser };

