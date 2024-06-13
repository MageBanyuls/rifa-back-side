import { prismaError } from "./injection.js";
import { CustomError } from "./handlerResponse.js";
async function handlePrismaError(error) {
    console.log("debug error prisma", error)
    if (error instanceof prismaError.PrismaClientValidationError) {
        // Error específico de Prisma por tipo de dato incorrecto
        throw new CustomError(400, 'Bad Request', 'Invalid value provided for one or more fields.');
    } else if (error instanceof prismaError.PrismaClientKnownRequestError) {
        // Tratamiento de errores conocidos de Prisma
        if (error.code === 'P2002') {
            throw new CustomError(409, 'Conflict', 'There is a unique constraint violation, a new record cannot be created with this unique field.');
        } else if (error.code === 'P2010' && error.meta && error.meta.code === '1054') {
            // Error específico cuando hay un problema en la consulta SQL, como una columna desconocida
            throw new CustomError(400, 'Bad Request', `Database query error: ${error.meta.message}`);
        } else {
            // Otros errores de Prisma no específicamente manejados
            throw new CustomError(500, 'Internal Server Error', 'An unexpected error occurred in the database operation.');
        }
    } else {
        // Para cualquier otro tipo de error
        console.log("ACA ESTA EL ERROR", error)
        throw new CustomError(500, "Internal Server Error", {error: error.message});
    }
}

export default handlePrismaError;