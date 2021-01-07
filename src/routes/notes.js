const { request, response } = require('express');

const router = require('express').Router();
const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes', isAuthenticated, async (req, res) => {
    // console.log('probando notas');
    await Note.find({user: req.user.id}).sort({ date: 'desc' }).then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
                return {
                    _id: documento._id,
                    title: documento.title,
                    description: documento.description
                }
            })
        }
        res.render('notes/all_notes', { notes: contexto.notes })
    })
});

router.get('/notes/add',isAuthenticated, (request, response) => {
    // response.send('TUS DATOS DE LA BD');
    response.render('notes/new');
});

router.get('/notes/edit/:id',isAuthenticated, async (request, response) => {
    const note = await Note.findById(request.params.id).lean();
    response.render('notes/edit-note', {note});
});

router.put('/notes/edit-note/:id',isAuthenticated, async (request, response) => {
    const { title, description } = request.body;
    await Note.findByIdAndUpdate(request.params.id, { title, description });
    request.flash('success_msg', 'Nota actualizada correctamente!');
    response.redirect('/notes');
});

router.delete('/notes/delete/:id',isAuthenticated, async (request, response) => { 
    await Note.findByIdAndDelete(request.params.id);
    request.flash('success_msg', 'Nota eliminada correctamente!');
    response.redirect('/notes');
})

router.post('/notes/new',isAuthenticated, async (request, response) => {
    const { title, description } = request.body;
    const errors = [];
    if (!title) {
        errors.push({ text: 'Necesita un titulo su tarjeta!' });
    }
    if (!description) {
        errors.push({ text: 'Necesita una descripcion su tarjeta!' });
    }
    if (errors.length > 0) {
        response.render('notes/new', {
            errors,
            title,
            description
        })
    } else {
        // response.send('ok');
        const newNote = new Note({ title, description });
        newNote.user = request.user.id;
        await newNote.save();
        // console.log(newNote._id);
        request.flash('success_msg', 'Nota agregada correctamente!');
        response.redirect('/notes');
    }
});

module.exports = router;