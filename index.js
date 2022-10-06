const port = process.env.PORT || 3000;
const { app, express } = require("./server");
const path = require("path");

// connexion a mongoDB
const mongoose = require("mongoose");
const userName = process.env.DBUSER
const password = process.env.DBPASSWORD;
const uri = `mongodb+srv://${userName}:${password}@cluster0.syvkejs.mongodb.net/?retryWrites=true&w=majority`;

mongoose
    .connect(uri)
    .then(() => console.log("Connecté à Mongo !"))
    .catch((err) => console.error("Erreur de connexion à Mongo !", err));

// Gestion utilisateurs
const { createUser, logUser } = require("./controllers/user");
const { getSauces, createSauce, getSauceById, deleteSauce, updateSauce } = require("./controllers/sauces");

// Middleware
const { upload } = require("./middleware/multer");
const { authoriseUser } = require("./middleware/auth");

/*permet de recuperer informations request*/
app.use(express.json());

// Routes
app.post("/api/auth/signup", createUser);
app.post("/api/auth/login", logUser);
app.get("/api/sauces", authoriseUser, getSauces);
app.post("/api/sauces", authoriseUser, upload.single("image"), createSauce);
app.get("/api/sauces/:id", authoriseUser, getSauceById)
app.delete("/api/sauces/:id", authoriseUser, deleteSauce)
app.put("/api/sauces/:id", authoriseUser, upload.single("image"), updateSauce)

// Listen
app.use("/images", express.static(path.join(__dirname, "images")));
app.listen(port, () => {
    console.log("listening on port : " + port);
});
