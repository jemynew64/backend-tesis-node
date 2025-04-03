import { Request, Response } from "express";
import {RetoModel} from "../database/prismaClient"
import {RetoSchema,RetoType} from "../schemas/index"
import {handleErrorResponse } from "../utils/errorHandler"

export const getReto = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;  // Página actual (por defecto 1)
        const limit = Number(req.query.limit) || 10; // Reto por página (por defecto 10)

        const Reto = await RetoModel.findMany({
            take: limit,  // Cantidad de Reto por página
            skip: (page - 1) * limit, // Cuántos Reto saltar antes de empezar
        });

        res.status(200).json(Reto);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};


//buscar un Reto por id
export const getRetoById = async (req:Request, res:Response) => {
    try{
        //req.params es un objeto que contiene los parámetros de la ruta en este caso contiene el id 
        const { id } = req.params;
        const Reto = await RetoModel.findUnique({
            where: { id: Number(id) },
        });
        if (!Reto) {
            res.status(404).json({ message: "Reto no encontrada" });
        }
        res.status(200).json(Reto);
    }catch(error){
        handleErrorResponse(res, error);
    }   
}

export const createReto = async (req: Request, res: Response) => {
    try {
        // Validar los datos con Zod
        const RetoData: RetoType = RetoSchema.parse(req.body);

        // Crear Reto en la base de datos
        const nuevoReto = await RetoModel.create({
            data: {
                ...RetoData
            },
        });

        res.status(201).json(nuevoReto);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const deleteReto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await RetoModel.delete({
            where: { id: Number(id) },
        });
        // Cambiado a 200 OK con mensaje de confirmación
        res.status(200).json({ 
            message: "Reto eliminado correctamente",
                });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const updateReto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Validar los datos con Zod uso esto Partial<RetoType> para que la validacion sea opcional
        const RetoData: Partial<RetoType> = RetoSchema.partial().parse(req.body);
        
        // Actualizar Reto en la base de datos
        const RetoActualizado = await RetoModel.update({
            where: { id: Number(id) },
            data: RetoData,
        });
        
        res.status(200).json(RetoActualizado);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};