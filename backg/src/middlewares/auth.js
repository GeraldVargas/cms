const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ mensaje: 'No hay token, permiso denegado 🛑' });
    }

    try {
        const cifrado = jwt.verify(token, process.env.JWT_SECRET);
        
        req.usuario = cifrado.usuario;
        
        next();

    } catch (error) {
        res.status(401).json({ mensaje: 'Token no válido ❌' });
    }
};