const port = process.env.PORT || 3000;
const { app, express } = require("./server");
const path = require("path");
const helmet = require("helmet");

// connexion a mongoDB
const mongoose = require("mongoose");
const userName = process.env.DBUSER
const password = process.env.DBPASSWORD;
const uri = `mongodb+srv://${userName}:${password}@cluster0.syvkejs.mongodb.net/?retryWrites=true&w=majority`;

mongoose
    .connect(uri)
    .then(() => console.log("Connecté à Mongo !"))
    .catch(() => console.error("Erreur de connexion à Mongo !"));

// Gestion utilisateurs
const { createUser, logUser } = require("./controllers/user");
const { getSauces, createSauce, getSauceById, deleteSauce, updateSauce, rateSauce } = require("./controllers/sauce");

// Middleware
app.use(express.json());

const { upload } = require("./middleware/multer");

const { authorizeUser } = require("./middleware/auth");

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Routes
app.post("/api/auth/signup", createUser);
app.post("/api/auth/login", logUser);
app.get("/api/sauces", authorizeUser, getSauces);
app.post("/api/sauces", authorizeUser, upload.single("image"), createSauce);
app.get("/api/sauces/:id", authorizeUser, getSauceById)
app.delete("/api/sauces/:id", authorizeUser, deleteSauce)
app.put("/api/sauces/:id", authorizeUser, upload.single("image"), updateSauce)
app.post("/api/sauces/:id/like", authorizeUser, rateSauce)
// Listen
app.use("/images", express.static(path.join(__dirname, "images")));
app.listen(port, () => {
    console.log("listening on port : " + port);
});
