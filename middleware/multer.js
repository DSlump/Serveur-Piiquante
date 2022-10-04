const multer = require("multer")

const storage = multer.diskStorage({
    destination:"images/",
    filename: function (req, file, cb) {
        cb(null, createFileName(req,file))

    }
})
/* ajout du fileName a la suite de notre req.file pour le recuperer,
 (.replace(...)) sert a remplacer les espaces présents dans la constante par des - */ 
function createFileName(req, file) {
    const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g,"-")
    file.fileName = fileName
    return fileName
}

const upload = multer({storage: storage})


module.exports = {upload}