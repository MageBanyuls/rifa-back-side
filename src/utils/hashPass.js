import bcrypt from 'bcrypt'


export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//  * @param {*} user usuario encontrado en base de datos.
//  * @param {*} password contraseña proporcionada por el usuario, sin encriptar.
//  * @returns boolean
//  */

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);