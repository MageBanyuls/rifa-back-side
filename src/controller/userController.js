import userService from "../service/userService.js";
import { CustomError } from "../utils/handlerResponse.js";

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
     // Validación básica
    if (!email || !password) {
        throw new CustomError(400, "Bad Request", { detail: "Email and password are required." });
    }
    try {
        const result = await userService.login(email, password);
        ResponseHandler.Ok(res, result)
    } catch (error) {
        ResponseHandler.HandleError(res, error)
    }
}

export const signUpUser = async (req, res, next) => {
    const data = req.body;
    try {
        const result = await userService.signUpUser(data);
        ResponseHandler.Ok(res, result)
    } catch (error) {
        ResponseHandler.HandleError(res, error)
    }
}

export const completeRegister = async (req, res, next) => {
    const data = req.body;
    try {
        const result = await userService.completeRegister(data);
        ResponseHandler.Ok(res, result)
    } catch (error) {
        ResponseHandler.HandleError(res, error)
    }
}

export const resetPass = async (req, res, next) => {
    const id = req.params;
    const pass = req.body;
    try {
        const result = await userService.resetPass(id, pass);
        ResponseHandler.Ok(res, result)
    } catch (error) {
        ResponseHandler.HandleError(res, error)
    }
}

export const getUserById = async (req, res, next) => {
    const id = req.params;
    try {
        const result = await userService.getUserById(id);
        ResponseHandler.Ok(res, result)
    } catch (error) {
        ResponseHandler.HandleError(res, error)
    }
}

