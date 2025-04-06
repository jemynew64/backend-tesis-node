import { Request, Response } from "express";
import {UnidadModel} from "../../database/prismaClient"
import {UnidadSchema,UnidadType} from "../../schemas/index"
import {handleErrorResponse } from "../../utils/errorhandler"

export const getUnidad = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;  // Página actual (por defecto 1)
        const limit = Number(req.query.limit) || 10; // Unidad por página (por defecto 10)

        const Unidad = await UnidadModel.findMany({
            take: limit,  // Cantidad de Unidad por página
            skip: (page - 1) * limit, // Cuántos Unidad saltar antes de empezar
        });

        res.status(200).json(Unidad);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};


//buscar un Unidad por id
export const getUnidadById = async (req:Request, res:Response) => {
    try{
        //req.params es un objeto que contiene los parámetros de la ruta en este caso contiene el id 
        const { id } = req.params;
        const Unidad = await UnidadModel.findUnique({
            where: { id: Number(id) },
        });
        if (!Unidad) {
            res.status(404).json({ message: "Unidad no encontrada" });
        }
        res.status(200).json(Unidad);
    }catch(error){
        handleErrorResponse(res, error);
    }   
}

export const createUnidad = async (req: Request, res: Response) => {
    try {
        // Validar los datos con Zod
        const UnidadData: UnidadType = UnidadSchema.parse(req.body);

        // Crear Unidad en la base de datos
        const nuevoUnidad = await UnidadModel.create({
            data: {
                ...UnidadData
            },
        });

        res.status(201).json(nuevoUnidad);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const deleteUnidad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await UnidadModel.delete({
            where: { id: Number(id) },
        });
        // Cambiado a 200 OK con mensaje de confirmación
        res.status(200).json({ 
            message: "Unidad eliminado correctamente",
                });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const updateUnidad = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Validar los datos con Zod uso esto Partial<UnidadType> para que la validacion sea opcional
        const UnidadData: Partial<UnidadType> = UnidadSchema.partial().parse(req.body);
        
        // Actualizar Unidad en la base de datos
        const UnidadActualizado = await UnidadModel.update({
            where: { id: Number(id) },
            data: UnidadData,
        });
        
        res.status(200).json(UnidadActualizado);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};