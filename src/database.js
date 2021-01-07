const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/notes-db-app', {
mongoose.connect('mongodb+srv://richard:richarddev@cluster0.fkvje.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(db => console.log('ESTAMOS EN LA ONDA CONECTADOS A LA BD'))
    .catch(err => console.log(err));