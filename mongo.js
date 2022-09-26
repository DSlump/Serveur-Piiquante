const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator")
const userName = process.env.DBUSER
const password = process.env.DBPASSWORD;
const uri = `mongodb+srv://${userName}:${password}@cluster0.wj0dsmi.mongodb.net/?retryWrites=true&w=majority`;

mongoose
    .connect(uri)
    .then(() => console.log("Connecté à Mongo !"))
    .catch((err) => console.error("Erreur de connexion à Mongo !", err));

/* Schema suivi pour l'enregistrement d'utilisateurs, refus si mail deja present grace au plug-in uniqueValidator */
const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});
userSchema.plugin(uniqueValidator)


const user = mongoose.model("User", userSchema);

module.exports = {mongoose, user}