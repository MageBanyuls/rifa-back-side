import { v4 as uuidv4 } from 'uuid';
//Crea un id, generado con algun prefijo adelante
export const idgenerate = (prefix) =>{
    return `${prefix}-${uuidv4()}`;
}