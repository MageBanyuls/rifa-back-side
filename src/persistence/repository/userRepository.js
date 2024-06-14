import { prisma } from "../../utils/injection.js";
import handlePrismaError from "../../utils/prismaError.js";

class userRepository{

    async createUser(id, email) {
        try {
            console.log('entre al repo');
            return prisma.usuarios.create({
                data: {
                    id: id,
                    email: email
                }
            });
        } catch (error) {
            handlePrismaError(error);
        }
    }

    async findUserById(id) {
        try {
            const user = await prisma.usuarios.findUnique({
                where:{
                    id : id
                }
            })
            return user;
        } catch (error) {
            handlePrismaError(error)
        }
    }

    async resetPasswordUserOP(idUser, passwordHashed){
        try {
            return prisma.usuarios.update({
                where: {id : idUser},
                data: {
                    password: passwordHashed
                }
            })
        } catch (error) {
            handlePrismaError(error)
        }
    }

    async completeRegisterUser(data){
        try {
            return prisma.usuarios.update({
                where: {id : data.id},
                data : data
            })
        }catch(error){
            handlePrismaError(error)
        }
    }

    async findUserByEmail(email) {
        try {
            const user = await prisma.subusuarios.findFirst({
                where: {
                    email: email,
                }
            });
            if(!user){
                throw new CustomError(404, "User not found", {email, message: "No user found with provided email and password."})
            }
            return user;
        } catch (error) {
            handlePrismaError(error)
        }
    }

    //Verifica si el usuario existe por su email y devuelve true o false
    async userExists(email) {
        try {
            const response = await prisma.usuarios.findFirst({  
                where:{
                    email : email
                }
            })
            return response !== null;
        } catch (error) {
            handlePrismaError(error);
        }
    }

    async deleteUser(id) {
        try {
            const response = await prisma.usuarios.delete({  
                where:{
                    id : id
                }
            })
            return response !== null;
        } catch (error) {
            handlePrismaError(error);
        }
    }
}

export default new userRepository()