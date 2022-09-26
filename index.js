const port = process.env.PORT || 3000;
const { app, express } = require("./server");
const path = require("path");

// connexion a mongoDB
require("./mongo");

// Gestion utilisateurs
const { createUser, logUser } = require("./user.settings");
const { getSauces, createSauce, getSauceById, deleteSauce} = require("./sauces.settings");

// Middleware
const { upload } = require("./middleware/multer");
const { authentificateUser } = require("./middleware/authentificate");

/*permet de recuperer informations request*/
app.use(express.json());

// Routes
app.post("/api/auth/signup", createUser);
app.post("/api/auth/login", logUser);
app.get("/api/sauces", authentificateUser, getSauces);
app.post("/api/sauces",authentificateUser,upload.single("image"),createSauce);
app.get("/api/sauces/:id", authentificateUser, getSauceById)
app.delete("/api/sauces/:id", authentificateUser, deleteSauce)
app.get("/", (req, res) => res.send({ message: "Serveur Backend" }));

// Listen
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.listen(port, () => {
    console.log("listening on port : " + port);
});
