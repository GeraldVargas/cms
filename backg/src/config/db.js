const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🔥 Base de datos MongoDB conectada exitosamente');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = conectarDB;