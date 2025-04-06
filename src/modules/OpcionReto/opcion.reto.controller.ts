import { Request, Response } from "express";
import {OpcionRetoModel} from "../../database/prismaClient"
import {OpcionRetoSchema,OpcionRetoType} from "../../schemas/index"
import {handleErrorResponse } from "../../utils/errorhandler"

export const getOpcionReto = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;  // Página actual (por defecto 1)
        const limit = Number(req.query.limit) || 10; // OpcionReto por página (por defecto 10)

        const OpcionReto = await OpcionRetoModel.findMany({
            take: limit,  // Cantidad de OpcionReto por página
            skip: (page - 1) * limit, // Cuántos OpcionReto saltar antes de empezar
        });

        res.status(200).json(OpcionReto);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};


//buscar un OpcionReto por id
export const getOpcionRetoById = async (req:Request, res:Response) => {
    try{
        //req.params es un objeto que contiene los parámetros de la ruta en este caso contiene el id 
        const { id } = req.params;
        const OpcionReto = await OpcionRetoModel.findUnique({
            where: { id: Number(id) },
        });
        if (!OpcionReto) {
            res.status(404).json({ message: "OpcionReto no encontrada" });
        }
        res.status(200).json(OpcionReto);
    }catch(error){
        handleErrorResponse(res, error);
    }   
}

export const createOpcionReto = async (req: Request, res: Response) => {
    try {
        // Validar los datos con Zod
        const OpcionRetoData: OpcionRetoType = OpcionRetoSchema.parse(req.body);

        // Crear OpcionReto en la base de datos
        const nuevoOpcionReto = await OpcionRetoModel.create({
            data: {
                ...OpcionRetoData
            },
        });

        res.status(201).json(nuevoOpcionReto);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const deleteOpcionReto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await OpcionRetoModel.delete({
            where: { id: Number(id) },
        });
        // Cambiado a 200 OK con mensaje de confirmación
        res.status(200).json({ 
            message: "OpcionReto eliminado correctamente",
                });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const updateOpcionReto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Validar los datos con Zod uso esto Partial<OpcionRetoType> para que la validacion sea opcional
        const OpcionRetoData: Partial<OpcionRetoType> = OpcionRetoSchema.partial().parse(req.body);
        
        // Actualizar OpcionReto en la base de datos
        const OpcionRetoActualizado = await OpcionRetoModel.update({
            where: { id: Number(id) },
            data: OpcionRetoData,
        });
        
        res.status(200).json(OpcionRetoActualizado);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};