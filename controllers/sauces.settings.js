const { unlink } = require("fs")
const Sauce = require("../models/Sauce")

function getSauces(req, res) {
    Sauce
        .find({})
        .then((sauces) => res.send(sauces))
        .catch((error) => res.status(500).json({ error }));
}

function getSauceById(req, res) {
    const id = req.params.id;
    Sauce
        .findById(id)
        .then((sauce) => {
            res.send(sauce);
        })
        .catch((error) => {
            return res.status(500).json({ error });
        });
}

function modifySauce(req, res) {
    const id = req.params.id;
    const body = req.body

    Sauce
        .findByIdAndUpdate(id, body)
        .then(response => res.status(200).json({ message: "body sauce modifié", response }))
        .catch((error) => res.status(500).json({ error }));
}

function createSauce(req, res) {
    const parsedSauce = JSON.parse(req.body.sauce);
    const { userId, name, manufacturer, description, mainPepper, heat } =
        parsedSauce;
    const newSauce = new Sauce({
        userId: userId,
        name: name,
        manufacturer: manufacturer,
        description: description,
        mainPepper: mainPepper,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
            }`,
        heat: heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    newSauce
        .save()
        .then(() => {
            res.status(201).json({ message: "Sauce enregistrée" });
        })
        .catch((error) => {
            return res.status(500).json({ error });
        });
}

function deleteSauce(req, res) {
    const id = req.params.id;
    Sauce
        .findByIdAndDelete(id)
        .then(deleteLocalImage)
        .then(product => res.status(200).json({ message: "sauce supprimée", product }))
        .catch((error) => res.status(500).json({ error }));
}

function deleteLocalImage(product) {
    const imageUrl = product.imageUrl
    const imageToDelete = imageUrl.split("/")[4]
    unlink(`images/${imageToDelete}`, (err) => {
        console.error(err)
    })
    return product
}


module.exports = { getSauces, getSauceById, createSauce, deleteSauce, modifySauce };
