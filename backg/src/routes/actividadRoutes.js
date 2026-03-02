const express = require('express');
const router = express.Router();
const actividadController = require('../controllers/actividadController');
const upload = require('../middlewares/upload');

router.get('/', actividadController.obtenerActividades);
router.delete('/:id', actividadController.eliminarActividad);
router.post('/', upload.single('imagen'), actividadController.crearActividad);
router.put('/:id', upload.single('imagen'), actividadController.actualizarActividad);

module.exports = router;