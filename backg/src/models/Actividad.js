const mongoose = require('mongoose');

const actividadSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true
    },
    fechaEvento: {
        type: Date,
        required: true
    },
    lugar: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        default: ""
    },
    estado: {
        type: String,
        enum: ['Próximamente', 'En curso', 'Finalizada'], 
        default: 'Próximamente'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Actividad', actividadSchema);