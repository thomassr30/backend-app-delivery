const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')

module.exports = {

    login(req, res){
        const email = req.body.email;
        const password = req.body.password;

        User.findByEmail(email, async (err, data) => {

            console.log('usuario, ',data)
            console.log('error, ',err)

            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro de usuario',
                    error: err
                })
            }

            if(!data){
                return res.status(401).json({
                    success: false,
                    message: 'El email no fue encontrado'
                })
            }

            const isPasswordValid = await bcrypt.compare(password, data.password)

            if(isPasswordValid){
                const token = jwt.sign({id: data.id, email: data.email}, keys.secretOrKey, {})
                const datos = {
                    id: data.id,
                    name: data.name,
                    lastname: data.lastname,
                    phone: data.phone,
                    email: data.email,
                    image: data.image,
                    token: `JWT ${token}`
                }
                return res.status(201).json({
                    success: true,
                    message: 'El usuario fue autenticado',
                    datos // el id que se registro
                })
            }else{
                return res.status(401).json({
                    success: false,
                    message: 'El password es incorrecto'
                })
            }

        })
    },

    register (req, res) {
        const user = req.body // capturo los datos que envia el cliente
        User.create(user, (err, data) => {
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro de usuario',
                    error: err
                })
            }

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data // el id que se registro
            })
        })
    }
}
