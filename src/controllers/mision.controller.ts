import { Request, Response } from "express";
import {MisionModel} from "../database/prismaClient"
import {MisionSchema,MisionType} from "../schemas/index"
import {handleErrorResponse } from "../utils/errorHandler"

export const getMision = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;  // Página actual (por defecto 1)
        const limit = Number(req.query.limit) || 10; // Mision por página (por defecto 10)

        const Mision = await MisionModel.findMany({
            take: limit,  // Cantidad de Mision por página
            skip: (page - 1) * limit, // Cuántos Mision saltar antes de empezar
        });

        res.status(200).json(Mision);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};


//buscar un Mision por id
export const getMisionById = async (req:Request, res:Response) => {
    try{
        //req.params es un objeto que contiene los parámetros de la ruta en este caso contiene el id 
        const { id } = req.params;
        const Mision = await MisionModel.findUnique({
            where: { id: Number(id) },
        });
        if (!Mision) {
            res.status(404).json({ message: "Mision no encontrada" });
        }
        res.status(200).json(Mision);
    }catch(error){
        handleErrorResponse(res, error);
    }   
}

export const createMision = async (req: Request, res: Response) => {
    try {
        // Validar los datos con Zod
        const MisionData: MisionType = MisionSchema.parse(req.body);

        // Crear Mision en la base de datos
        const nuevoMision = await MisionModel.create({
            data: {
                ...MisionData
            },
        });

        res.status(201).json(nuevoMision);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const deleteMision = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await MisionModel.delete({
            where: { id: Number(id) },
        });
        // Cambiado a 200 OK con mensaje de confirmación
        res.status(200).json({ 
            message: "Mision eliminado correctamente",
                });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const updateMision = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Validar los datos con Zod uso esto Partial<MisionType> para que la validacion sea opcional
        const MisionData: Partial<MisionType> = MisionSchema.partial().parse(req.body);
        
        // Actualizar Mision en la base de datos
        const MisionActualizado = await MisionModel.update({
            where: { id: Number(id) },
            data: MisionData,
        });
        
        res.status(200).json(MisionActualizado);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};