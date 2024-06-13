
const HttpStatus = {
    OK: 200,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500
};
// 404:  la página o el archivo solicitado no se encontró. 
// 401:  la página a la que intentabas acceder no puede cargarse hasta que primero inicies sesión con un ID de usuario y una contraseña válidos.
// 403:  el servidor comprende la solicitud, pero se niega a autorizarla. Este estado es similar al 401, pero para el código de estado 403 Forbidden, volver a autenticarse no hace ninguna diferencia.
// 500:  algo salió mal en el servidor del sitio web, pero el servidor no pudo ser más específico sobre cuál es el problema exacto.
export class HttpResponseHandlder {
    Ok(res, payload) {
        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Success',
            payload: payload
        });
    }
    NotFound(res, payload) {
        return res.status(HttpStatus.NOT_FOUND).json({
            status: HttpStatus.NOT_FOUND,
            message: 'Not Found',
            error: payload
        });
    }
    Unauthorized(res, payload) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
            status: HttpStatus.UNAUTHORIZED,
            message: 'Unauthorized',
            error: payload
        });
    }
    Forbidden(res, payload) {
        return res.status(HttpStatus.FORBIDDEN).json({
            status: HttpStatus.FORBIDDEN,
            message: 'Forbidden',
            error: payload
        });
    }
    ServerError(res, payload) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal Server Error',
            error: payload
        });
    }
    HandleError(res, error) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                payload: error.data
            });
        } else {
            return this.ServerError(res, error.message);
        }
    }
}
export class CustomError extends Error {
    constructor(statusCode, message, data = {}) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }
}
