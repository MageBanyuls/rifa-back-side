export const validatePassword = (password, passwordConfirm)=>{
    // Verificar que las contraseñas no estén vacías
    if (!password.trim() || !passwordConfirm.trim()) {
        return { isValid: false, message: "Las contraseñas no pueden estar vacías." };
    }
    // Verificar la longitud mínima de la contraseña
    const minLength = 8;
    if (password.length < minLength || passwordConfirm.length < minLength) {
        return { isValid: false, message: `La contraseña debe tener al menos ${minLength} caracteres.` };
    }
    // Verificar la inclusión de al menos un número
    if (!/\d/.test(password) || !/\d/.test(passwordConfirm)) {
        return { isValid: false, message: "La contraseña debe incluir al menos un número." };
    }
    // Verificar la inclusión de al menos una mayúscula
    if (!/[A-Z]/.test(password) || !/[A-Z]/.test(passwordConfirm)) {
        return { isValid: false, message: "La contraseña debe incluir al menos una mayúscula." };
    }
    // Verificar la inclusión de al menos un carácter especial
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(passwordConfirm)) {
        return { isValid: false, message: "La contraseña debe incluir al menos un carácter especial." };
    }
    // Verificar que las contraseñas coincidan
    if (password !== passwordConfirm) {
        return { isValid: false, message: "Las contraseñas no coinciden." };
    }
    // Si todas las validaciones pasan
    return { isValid: true, message: "" };
}