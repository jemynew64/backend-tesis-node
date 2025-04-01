import { Request, Response } from "express";
import {UserModel} from "../database/prismaClient"
import {UsuarioSchema,UsuarioType} from "../schemas/Usuario.schema"
import {handleErrorResponse } from "../utils/errorHandler"
import { hashPassword } from "../utils/hashPassword";

//buscar toda la lista de usuarios
export const getUsuarios = async (req:Request, res:Response) => {
    try{
        const usuarios = await UserModel.findMany()
        res.status(200).json(usuarios);
    }catch(error){
        handleErrorResponse(res, error);
    }   
}

//buscar un usuario por id
export const getUsuarioById = async (req:Request, res:Response) => {
    try{
        //req.params es un objeto que contiene los parámetros de la ruta en este caso contiene el id 
        const { id } = req.params;
        const usuario = await UserModel.findUnique({
            where: { id: Number(id) },
        });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
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
        res.status(204).send();
    } catch (error) {
        handleErrorResponse(res, error);
    }
};
