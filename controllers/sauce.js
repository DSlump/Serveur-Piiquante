const { unlinkSync } = require("fs")
const Sauce = require("../models/Sauce")

function getSauces(req, res) {
    Sauce
        .find({})
        .then((sauces) => res.status(200).json(sauces))
        .catch(() => res.status(404).json({ message: "Aucune sauce trouvée" }));
}

function getSauceById(req, res) {
    const id = req.params.id;
    Sauce
        .findById(id)
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch(() => {
            return res.status(404).json({ message: "Aucune sauce trouvée" });
        });
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
        .catch(() => {
            return res.status(400).json({ message: "Sauce non enregistrée" });
        });
}

function updateSauce(req, res) {
    const id = req.params.id;
    const hasNewImage = req.file != null
    const payload = createPayload(req, hasNewImage)
    Sauce
        .findByIdAndUpdate(id, payload)
        .then((sauce) => removeLocalImage(sauce, hasNewImage))
        .then(() => {
            return res.status(200).json({ message: "Sauce mise a jour" });
        })
        .catch(() => {
            return res.status(400).json({ message: "Sauce non mise a jour" });
        });
}

function deleteSauce(req, res) {
    const id = req.params.id;
    Sauce
        .findByIdAndDelete(id)
        .then((response) => deleteLocalImage(response))
        .then(product => {
            return res.status(200).json({ message: "sauce supprimée", product });
        })
        .catch(() => {
            return res.status(400).json({ message: "sauce non supprimée" });
        });
}

function createPayload(req, hasNewImage) {
    if (!hasNewImage) return req.body

    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    return payload
}

function removeLocalImage(sauce, hasNewImage) {
    if (!hasNewImage) return sauce
    const imageToDelete = sauce.imageUrl.split("/")[4]
    unlinkSync(`images/${imageToDelete}`, (err) => {
        console.error(err)
    })
    return sauce
}

function deleteLocalImage(response) {
    const imageToDelete = response.imageUrl.split("/")[4]
    unlinkSync(`images/${imageToDelete}`, (err) => {
        console.error(err)
    })
    return response
}

function rateSauce(req, res) {
    const userId = req.body.userId;
    const sauceId = req.params.id;
    const rate = req.body.like;
    console.log("likes", rate)
    if (rate === 1) {
        Sauce
            .findByIdAndUpdate(sauceId, {$inc: { likes: rate}, $pull: { usersLiked: userId }})
            .then((sauce) => res.status(200).json({message : "Sauce likée", sauce}))
            .catch(() => {
                return res.status(400).json({ message: "sauce non notée" });
            });
    }
    else if (rate === -1) {
        Sauce
            .findByIdAndUpdate(sauceId, {$inc: { likes: rate}, $pull: { usersLiked: userId }})
            .then((sauce) => res.status(200).json({message : "Sauce dislikée", sauce}))
            .catch(() => {
                return res.status(400).json({ message: "sauce non notée" });
            });
    }
    else if (rate === 0) {
        const sauce = Sauce.findById(sauceId).then((sauce) => sauce)

        console.log(sauce)

        if (sauce.usersLiked.includes(userId)) {
            // alors on retire un like de l'incrémenteur
            // et on retire l'userID de l'array
        }

        if (sauce.usersDisliked.includes(userId)) {
            // alors on retire un like de l'incrémenteur
            // et on retire l'userID de l'array
        }
    }
}

module.exports = { getSauces, getSauceById, createSauce, deleteSauce, updateSauce, rateSauce };
