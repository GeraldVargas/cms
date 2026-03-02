const Noticia = require('../models/Noticia');

exports.crearNoticia = async (req, res) => {
    try {
        const nuevaNoticia = new Noticia(req.body);
        if (req.file) nuevaNoticia.imagen = req.file.filename;
        await nuevaNoticia.save();
        res.status(201).json({ mensaje: 'Noticia creada con éxito', noticia: nuevaNoticia });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al crear la noticia' });
    }
};

exports.obtenerNoticias = async (req, res) => {
    try {
        const noticias = await Noticia.find().sort({ createdAt: -1 });
        res.status(200).json(noticias);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al obtener las noticias' });
    }
};

exports.actualizarNoticia = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('=== ACTUALIZAR NOTICIA ===');
        console.log('ID recibido :', id);
        console.log('req.body    :', req.body);
        console.log('req.file    :', req.file);
        console.log('Content-Type:', req.headers['content-type']);

        const body = req.body || {};

        const datosActualizados = {};
        if (body.titulo    !== undefined) datosActualizados.titulo    = body.titulo;
        if (body.contenido !== undefined) datosActualizados.contenido = body.contenido;
        if (req.file)                     datosActualizados.imagen    = req.file.filename;

        if (Object.keys(datosActualizados).length === 0) {
            return res.status(400).json({
                mensaje: 'No se recibieron datos. ' +
                         'Verifica que la ruta PUT tenga upload.single("imagen") como middleware.'
            });
        }

        const noticiaActualizada = await Noticia.findByIdAndUpdate(
            id,
            datosActualizados,
            { new: true }
        );

        if (!noticiaActualizada) {
            return res.status(404).json({ mensaje: 'No se encontró la noticia' });
        }

        res.status(200).json({ mensaje: 'Noticia actualizada con éxito', noticia: noticiaActualizada });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al actualizar la noticia' });
    }
};

exports.eliminarNoticia = async (req, res) => {
    try {
        const { id } = req.params;
        const noticiaEliminada = await Noticia.findByIdAndDelete(id);
        if (!noticiaEliminada) {
            return res.status(404).json({ mensaje: 'No se encontró la noticia' });
        }
        res.status(200).json({ mensaje: 'Noticia eliminada correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al eliminar la noticia' });
    }
};