import { Request, Response } from "express";
import {LogroModel} from "../../database/prismaClient"
import {LogroSchema,LogroType} from "../../schemas/index"
import {handleErrorResponse } from "../../utils/errorhandler"

export const getLogro = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;  // Página actual (por defecto 1)
        const limit = Number(req.query.limit) || 10; // Logro por página (por defecto 10)

        const Logro = await LogroModel.findMany({
            take: limit,  // Cantidad de Logro por página
            skip: (page - 1) * limit, // Cuántos Logro saltar antes de empezar
        });

        res.status(200).json(Logro);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};


//buscar un Logro por id
export const getLogroById = async (req:Request, res:Response) => {
    try{
        //req.params es un objeto que contiene los parámetros de la ruta en este caso contiene el id 
        const { id } = req.params;
        const Logro = await LogroModel.findUnique({
            where: { id: Number(id) },
        });
        if (!Logro) {
            res.status(404).json({ message: "Logro no encontrada" });
        }
        res.status(200).json(Logro);
    }catch(error){
        handleErrorResponse(res, error);
    }   
}

export const createLogro = async (req: Request, res: Response) => {
    try {
        // Validar los datos con Zod
        const LogroData: LogroType = LogroSchema.parse(req.body);

        // Crear Logro en la base de datos
        const nuevoLogro = await LogroModel.create({
            data: {
                ...LogroData
            },
        });

        res.status(201).json(nuevoLogro);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const deleteLogro = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await LogroModel.delete({
            where: { id: Number(id) },
        });
        // Cambiado a 200 OK con mensaje de confirmación
        res.status(200).json({ 
            message: "Logro eliminado correctamente",
                });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const updateLogro = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Validar los datos con Zod uso esto Partial<LogroType> para que la validacion sea opcional
        const LogroData: Partial<LogroType> = LogroSchema.partial().parse(req.body);
        
        // Actualizar Logro en la base de datos
        const LogroActualizado = await LogroModel.update({
            where: { id: Number(id) },
            data: LogroData,
        });
        
        res.status(200).json(LogroActualizado);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};