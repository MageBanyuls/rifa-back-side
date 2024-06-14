import { idgenerate } from "../utils/idGenerate.js";
import userRepository from "../persistence/repository/userRepository.js";
import { createHash, isValidPassword } from "../utils/hashPass.js";
import { CustomError } from "../utils/handlerResponse.js";
import jwt from "jsonwebtoken";
import "dotenv/config"

class UserService{

    async getUserById(id) {
        try {
            
            const user = await userRepository.findUserById(id);
            if (!userser) {
                throw new CustomError(404, "El usuario no existe", { id: id });
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async signUpUser(data){

        try {

            const idplanuser = idgenerate('plan-user-')
            
            const passwordHashed = createHash(data.password)

            const user = await userRepository.createUser({idplanuser: idplanuser,password:passwordHashed,...data});

            return user;

        }catch(error){

            throw (error)
        }
    }

    async resetPass (id, password){

        try{

        const passwordHashed = createHash(password);

        const reset = await userRepository.resetPasswordUserOP(id,{password:passwordHashed});
        
        return reset;

        }catch(error){

            throw(error)
        }
    }

    async login (email, password){
        try{
            const user = userRepository.findUserByEmail(email);

            if (!user){
                throw new CustomError(401, "Authentication error", { detail: "Invalid credentials" });
            }

            const passwordOk = isValidPassword(user,password)

            if (!passwordOk){
                throw new CustomError(401, "Authentication error", { detail: "Invalid credentials" });
            }

            const tokenData = {
                id: user.id,
                email: user.email,
                fecha_de_nacimiento: user.fecha_de_nacimiento,
                celular : user.celular,
                nombre : user.nombre,
                apellido : user.apellido,
                RUT: user.rut
            };

            const token = jwt.sign(tokenData, process.env.SECRET_KEY_LOGIN);

            return {
                token
            };


        }catch(error){
            throw (error);
        }
    }

    async completeRegister(data) {
        try {
            
            const user = await userRepository.findUserById(data.id);
            if (!user) {
                throw new CustomError(404, "El usuario no existe", { id: id });
            }

            const usercomplete = await userRepository.completeRegisterUser(data);

            return usercomplete;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id){
        try{
            return userRepository.deleteUser(id);
        }catch(error){
            throw error;
        }
    }


}

export default new UserService()