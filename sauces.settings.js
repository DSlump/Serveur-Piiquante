const {unlink} = require("fs")
const mongoose = require("mongoose");

const sauceSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: Number,
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String],
});
const sauce = new mongoose.model("sauce", sauceSchema);

function getSauces(req, res) {
    sauce
        .find({})
        .then((sauces) => res.send(sauces))
        .catch((error) => res.status(500).send(error));
}

function getSauceById(req, res) {
    const id = req.params.id;
    sauce
        .findById(id)
        .then((sauce) => {
            res.send(sauce);
        })
        .catch((error) => {
            return res.status(500).send(error);
        });
}

function createSauce(req, res) {
    const parsedSauce = JSON.parse(req.body.sauce);
    const { userId, name, manufacturer, description, mainPepper, heat } =
        parsedSauce;
    const newSauce = new sauce({
        userId: userId,
        name: name,
        manufacturer: manufacturer,
        description: description,
        mainPepper: mainPepper,
        imageUrl: `${req.protocol}://${req.get("host")}/uploads/${
            req.file.filename
        }`,
        heat: heat,
        likes: 0,
        dislikes: 0,
        usersLiked: ["liked"],
        usersDisliked: ["disliked"],
    });
    newSauce
        .save()
        .then(() => {
            res.status(201).send({ message: "Sauce enregistrée" });
        })
        .catch((error) => {
            return res.status(500).send(error);
        });
}

function deleteSauce(req, res) {
    const id = req.params.id;
    sauce
        .findByIdAndDelete(id)
        .then(deleteLocalImage)
        .then(product => res.send({ message: "sauce supprimée", product }))
        .catch((error) =>res.status(500).send(error));
}

function deleteLocalImage(product) {
    const imageUrl = product.imageUrl
    const imageToDelete = imageUrl.split("/")[4]
    unlink(`uploads/${imageToDelete}`, (err) => {
        console.error(err)
    })
    return product
}

module.exports = { getSauces, getSauceById, createSauce, deleteSauce };
