import { Request, Response } from "express";
import {LogroObtenidoModel} from "../database/prismaClient"
import {LogroObtenidoSchema,LogroObtenidoType} from "../schemas/index"
import {handleErrorResponse } from "../utils/errorHandler"

export const getLogroObtenidoObtenido = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;  // Página actual (por defecto 1)
        const limit = Number(req.query.limit) || 10; // LogroObtenido por página (por defecto 10)

        const LogroObtenido = await LogroObtenidoModel.findMany({
            take: limit,  // Cantidad de LogroObtenido por página
            skip: (page - 1) * limit, // Cuántos LogroObtenido saltar antes de empezar
        });

        res.status(200).json(LogroObtenido);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};


//buscar un LogroObtenido por id
export const getLogroObtenidoById = async (req:Request, res:Response) => {
    try{
        //req.params es un objeto que contiene los parámetros de la ruta en este caso contiene el id 
        const { id } = req.params;
        const LogroObtenido = await LogroObtenidoModel.findUnique({
            where: { id: Number(id) },
        });
        if (!LogroObtenido) {
            res.status(404).json({ message: "LogroObtenido no encontrada" });
        }
        res.status(200).json(LogroObtenido);
    }catch(error){
        handleErrorResponse(res, error);
    }   
}

export const createLogroObtenido = async (req: Request, res: Response) => {
    try {
        // Validar los datos con Zod
        const LogroObtenidoData: LogroObtenidoType = LogroObtenidoSchema.parse(req.body);

        // Crear LogroObtenido en la base de datos
        const nuevoLogroObtenido = await LogroObtenidoModel.create({
            data: {
                ...LogroObtenidoData
            },
        });

        res.status(201).json(nuevoLogroObtenido);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const deleteLogroObtenido = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await LogroObtenidoModel.delete({
            where: { id: Number(id) },
        });
        // Cambiado a 200 OK con mensaje de confirmación
        res.status(200).json({ 
            message: "LogroObtenido eliminado correctamente",
                });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const updateLogroObtenido = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Validar los datos con Zod uso esto Partial<LogroObtenidoType> para que la validacion sea opcional
        const LogroObtenidoData: Partial<LogroObtenidoType> = LogroObtenidoSchema.partial().parse(req.body);
        
        // Actualizar LogroObtenido en la base de datos
        const LogroObtenidoActualizado = await LogroObtenidoModel.update({
            where: { id: Number(id) },
            data: LogroObtenidoData,
        });
        
        res.status(200).json(LogroObtenidoActualizado);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};