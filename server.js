const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app)
const logger = require('morgan')
const cors = require('cors')
const passport = require('passport')

// IMPORTAR RUTAS
const users = require('./routes/userRoutes')

const port = process.env.PORT || 5000;
app.use(logger('dev'));
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cors())
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)
app.disable('x-powered-by')
app.set('port', port);

users(app)

server.listen(port, '192.168.0.9' || 'localhost', () => {
    console.log('Servidor corriendo en el puerto 3000')
});

app.get('/test', (req, res) => {
    res.send('Ruta raiz back test')
})

// ERROR  HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack)
})


