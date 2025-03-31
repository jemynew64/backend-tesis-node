import { Request, Response } from "express";
import {UserModel} from "../database/prismaClient"
import {UsuarioSchema,UsuarioType} from "../schemas/Usuario.schema"
import {handleErrorResponse } from "../utils/errorHandler"

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
        // Validar la entrada  aca usa type y zod
        const usuarioData: UsuarioType = UsuarioSchema.parse(req.body);

        // Crear usuario en la base de datos
        const nuevoUsuario = await UserModel.create({
            data: usuarioData,
        });

        res.status(201).json(nuevoUsuario);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};