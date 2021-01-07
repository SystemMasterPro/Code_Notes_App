const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcryp = require('bcryptjs');
// CREAMOS NUESTRA TABLA POR ASI DECIRLO
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now }
});
// CIFRAMOS LA CONTRASEÑA INGRESADA PARA ALMACENARLA EN LA BASE DE DATOS
UserSchema.methods.encriptarClave = async (password) => { 
    const salt = await bcryp.genSalt(10);
    const hash = bcryp.hash(password, salt);
    return hash;
}
// VOLVEMOS A CIFRAR LA CLAVE PARA VALIDAR CON LA QUE ESTA EN LA BASE DE DATOS
UserSchema.methods.compararClaves = async function (password) { 
    return await bcryp.compare(password, this.password);
}
// EXPORTAMOS MUESTRO MODELO
module.exports = mongoose.model('User', UserSchema);