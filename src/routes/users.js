// const { request, response } = require('express');

const { request, response } = require('express');
const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/user/signup', (request, response) => {
    response.render('users/registro');
});

router.post('/user/signup', async (request, response) => {
    const { name, email, password, confirm_password } = request.body;
    const errors = [];
    // console.log(errors);
    if (name.length <= 0) {
        errors.push({ text: 'Campo vacio' });
    }
    if (password != confirm_password) {
        errors.push({ text: 'Las claves no coinciden!!!' });
    }
    if (password.length < 4) {
        errors.push({ text: 'La clave no debe ser menos a 4 caracteres!' });
    }
    if (errors.length > 0) {
        // console.log(errors);
        response.render('users/registro', { errors, name, email, password, confirm_password });
        // response.send('ok');
    } else {
        // response.render('users/sesion');
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            request.flash('error_msg', 'El usuario con este correo ya existe');
            response.redirect('/user/signup');
        } else {
            const newUser = new User({ name, email, password });
            newUser.password = await newUser.encriptarClave(password);
            await newUser.save();
            request.flash('success_msg', 'Usuario creado correctamente');
            response.redirect('/user/signin');
        }
    }
});

router.get('/user/signin', (request, response) => {
    response.render('users/sesion');
});

router.post('/user/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/user/signin',
    failureFlash: true
}));

router.get('/user/logout', (request, response) => {
    request.logout();
    response.redirect('/');
});

module.exports = router;