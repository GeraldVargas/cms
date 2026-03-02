const Actividad = require('../models/Actividad');

exports.crearActividad = async (req, res) => {
    try {
        const body = req.body || {};
        const nuevaActividad = new Actividad({
            titulo:      body.titulo,
            descripcion: body.descripcion,
            fechaEvento: body.fechaEvento,
            lugar:       body.lugar,
            estado:      body.estado || 'Próximamente',
        });
        if (req.file) nuevaActividad.imagen = req.file.filename;
        await nuevaActividad.save();
        res.status(201).json({ mensaje: 'Actividad creada con éxito', actividad: nuevaActividad });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Hubo un error al crear la actividad' });
    }
};

exports.obtenerActividades = async (req, res) => {
    try {
        const actividades = await Actividad.find().sort({ fechaEvento: 1 });
        res.status(200).json(actividades);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Hubo un error al obtener las actividades' });
    }
};

exports.actualizarActividad = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body || {};

        const datos = {};
        if (body.titulo      !== undefined) datos.titulo      = body.titulo;
        if (body.descripcion !== undefined) datos.descripcion = body.descripcion;
        if (body.fechaEvento !== undefined) datos.fechaEvento = body.fechaEvento;
        if (body.lugar       !== undefined) datos.lugar       = body.lugar;
        if (body.estado      !== undefined) datos.estado      = body.estado;
        if (req.file)                       datos.imagen      = req.file.filename;

        const actualizada = await Actividad.findByIdAndUpdate(id, datos, { new: true });
        if (!actualizada) return res.status(404).json({ mensaje: 'Actividad no encontrada' });

        res.status(200).json({ mensaje: 'Actividad actualizada', actividad: actualizada });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Hubo un error al actualizar la actividad' });
    }
};

exports.eliminarActividad = async (req, res) => {
    try {
        const eliminada = await Actividad.findByIdAndDelete(req.params.id);
        if (!eliminada) return res.status(404).json({ mensaje: 'Actividad no encontrada' });
        res.status(200).json({ mensaje: 'Actividad eliminada' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Hubo un error al eliminar la actividad' });
    }
};