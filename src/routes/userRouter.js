import { Router } from 'express';
import {
    signUpUser,
    resetPass,
    loginUser,
    getUserById,
    completeRegister,
    deleteUser
} from '../../src/controller/userController.js'

const router = Router()

// Ruta para ingresar a la plataforma

router.post('/login', loginUser)

// Ruta de creacion de usuarios

router.post('/sign-up', signUpUser)

// Ruta para obtener los datos del usuario por id

router.get('/user/:id', getUserById)

// Ruta para reset de datos

router.put('/reset', resetPass)

router.put('/complete-register', completeRegister)

router.delete('/delete/:id', deleteUser)

export default router