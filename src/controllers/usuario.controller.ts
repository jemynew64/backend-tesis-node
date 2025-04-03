import { Request, Response } from "express";
import {UserModel} from "../database/prismaClient"
import {UsuarioSchema,UsuarioType} from "../schemas/UsuarioSchema"
import {handleErrorResponse } from "../utils/errorHandler"
import { hashPassword } from "../utils/hashPassword";

export const getUsuarios = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;  // Página actual (por defecto 1)
        const limit = Number(req.query.limit) || 10; // Usuarios por página (por defecto 10)

        const usuarios = await UserModel.findMany({
            where: { tipo_usuario: "estudiante" },
            take: limit,  // Cantidad de usuarios por página
            skip: (page - 1) * limit, // Cuántos usuarios saltar antes de empezar
        });

        res.status(200).json(usuarios);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};


//buscar un usuario por id
export const getUsuarioById = async (req:Request, res:Response) => {
    try{
        //req.params es un objeto que contiene los parámetros de la ruta en este caso contiene el id 
        const { id } = req.params;
        const usuario = await UserModel.findUnique({
            where: { id: Number(id) },
        });
        if (!usuario) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }
        res.status(200).json(usuario);
    }catch(error){
        handleErrorResponse(res, error);
    }   
}
export const createUsuario = async (req: Request, res: Response) => {
    try {
        // Validar los datos con Zod
        const usuarioData: UsuarioType = UsuarioSchema.parse(req.body);

        // Verificar si el email ya está registrado
        const existingUser = await UserModel.findUnique({
            where: { email: usuarioData.email },
        });

        if (existingUser) {
            res.status(400).json({ error: "El email ya está registrado" });
            return;
        }

        // Hashear la contraseña antes de guardarla
        const hashedPassword = await hashPassword(usuarioData.contrasena);

        // Crear usuario en la base de datos
        const nuevoUsuario = await UserModel.create({
            data: {
                ...usuarioData,
                contrasena: hashedPassword, // Guardar la contraseña hasheada
            },
        });

        res.status(201).json(nuevoUsuario);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const deleteUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await UserModel.delete({
            where: { id: Number(id) },
        });
        // Cambiado a 200 OK con mensaje de confirmación
        res.status(200).json({ 
            message: "Usuario eliminado correctamente",
                });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const updateUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Validar los datos con Zod uso esto Partial<UsuarioType> para que la validacion sea opcional
        const usuarioData: Partial<UsuarioType> = UsuarioSchema.partial().parse(req.body);
        
        // Verificar si el usuario existe
        const existingUser = await UserModel.findUnique({
            where: { id: Number(id) },
        });
        
        if (!existingUser) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }
        
        // Si se está actualizando la contraseña, hay que hashearla
        if (usuarioData.contrasena) {
            usuarioData.contrasena = await hashPassword(usuarioData.contrasena);
        }
        
        // Actualizar usuario en la base de datos
        const usuarioActualizado = await UserModel.update({
            where: { id: Number(id) },
            data: usuarioData,
        });
        
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};