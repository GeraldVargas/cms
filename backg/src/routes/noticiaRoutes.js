const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const {
    crearNoticia,
    obtenerNoticias,
    actualizarNoticia,
    eliminarNoticia,
} = require('../controllers/noticiaController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get('/',    obtenerNoticias);
router.post('/',   upload.single('imagen'), crearNoticia);
router.put('/:id', upload.single('imagen'), actualizarNoticia);
router.delete('/:id', eliminarNoticia);

module.exports = router;