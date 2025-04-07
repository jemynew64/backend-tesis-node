import { Request, Response } from "express";
import {MisionUsuarioModel} from "../../database/prismaClient"
import {MisionUsuarioSchema,MisionUsuarioType} from "../../schemas/index"
import {handleErrorResponse } from "../../utils/errorhandler"

export const getMisionUsuario = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;  // Página actual (por defecto 1)
        const limit = Number(req.query.limit) || 10; // MisionUsuario por página (por defecto 10)

        const MisionUsuario = await MisionUsuarioModel.findMany({
            take: limit,  // Cantidad de MisionUsuario por página
            skip: (page - 1) * limit, // Cuántos MisionUsuario saltar antes de empezar
        });

        res.status(200).json(MisionUsuario);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};


//buscar un MisionUsuario por id
export const getMisionUsuarioById = async (req:Request, res:Response) => {
    try{
        //req.params es un objeto que contiene los parámetros de la ruta en este caso contiene el id 
        const { id } = req.params;
        const MisionUsuario = await MisionUsuarioModel.findUnique({
            where: { id: Number(id) },
        });
        if (!MisionUsuario) {
            res.status(404).json({ message: "MisionUsuario no encontrada" });
        }
        res.status(200).json(MisionUsuario);
    }catch(error){
        handleErrorResponse(res, error);
    }   
}

export const createMisionUsuario = async (req: Request, res: Response) => {
    try {
        // Validar los datos con Zod
        const MisionUsuarioData: MisionUsuarioType = MisionUsuarioSchema.parse(req.body);

        // Crear MisionUsuario en la base de datos
        const nuevoMisionUsuario = await MisionUsuarioModel.create({
            data: {
                ...MisionUsuarioData
            },
        });

        res.status(201).json(nuevoMisionUsuario);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const deleteMisionUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await MisionUsuarioModel.delete({
            where: { id: Number(id) },
        });
        // Cambiado a 200 OK con mensaje de confirmación
        res.status(200).json({ 
            message: "MisionUsuario eliminado correctamente",
                });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const updateMisionUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Validar los datos con Zod uso esto Partial<MisionUsuarioType> para que la validacion sea opcional
        const MisionUsuarioData: Partial<MisionUsuarioType> = MisionUsuarioSchema.partial().parse(req.body);
        
        // Actualizar MisionUsuario en la base de datos
        const MisionUsuarioActualizado = await MisionUsuarioModel.update({
            where: { id: Number(id) },
            data: MisionUsuarioData,
        });
        
        res.status(200).json(MisionUsuarioActualizado);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};