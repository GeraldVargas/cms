const mongoose = require('mongoose');

const noticiaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    contenido: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        default: ""
    },
    autor: {
        type: String,
        default: "Admin Noti"
    },
    estado: {
        type: String,
        enum: ['Borrador', 'Publicado'],
        default: 'Publicado'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Noticia', noticiaSchema);