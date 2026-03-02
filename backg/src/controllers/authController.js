const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }

        usuario = new Usuario({ nombre, email, password });

        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        await usuario.save();
        res.status(201).json({ mensaje: 'Usuario creado correctamente ✅' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Hubo un error al registrar el usuario' });
    }
};

exports.loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ mensaje: 'El usuario no existe' });
        }

        const passwordCorrecto = await bcryptjs.compare(password, usuario.password);
        if (!passwordCorrecto) {
            return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }

        const payload = { usuario: { id: usuario.id } };
        
        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '30d' },
            (error, token) => {
                if (error) throw error;
                res.json({ token, mensaje: 'Login exitoso 🔓' });
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Hubo un error al iniciar sesión' });
    }
};