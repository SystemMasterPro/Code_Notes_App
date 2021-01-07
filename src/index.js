const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const sesion = require('express-session');
const { response } = require('express');
const flash = require('connect-flash');
const { request } = require('http');
const passport = require('passport');

// Inicializacion de los modulos
const app = express();
// Estamos requiriendo nustra conexion a la base de datos
require('./database');
require('./config/passport');

// Configuraciones
// Variable para almacenar el puerto
app.set('port', process.env.PORT || 3000);
// Le decimos al servidor que vamos a trabajar con las vistas
app.set('views', path.join(__dirname, 'views'));
// Configuramos las vistas con nuestro motor de plantillas
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Funciones a ejecutar en el servidor
// Pasa la url 
app.use(express.urlencoded({ extended: false }));
// Adhiere las peticiones PUT Y POST 
app.use(methodOverride('_method'));
// Nos ayuda a autenticar el usuario
app.use(sesion({
    secret: 'seguridadweb',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Variables Globales
app.use((request, response, next) => { 
    response.locals.success_msg = request.flash('success_msg');
    response.locals.error_msg = request.flash('error_msg');
    response.locals.error = request.flash('error');
    response.locals.user = request.user || null;
    // console.log(response.locals.user);
    next();
})

// Rutas
// Requiero mis tres rutas creadas en la carpeta routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

// Archivos Estaticos 
app.use(express.static(path.join(__dirname, 'public')));

// Servidor en ejecucion
app.listen(app.get('port'), () => { 
    console.log('Servidor corriendo en el puerto ',app.get('port'));
})