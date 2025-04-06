import { Request, Response } from "express";
import {ProgresoLeccionModel} from "../database/prismaClient"
import {ProgresoLeccionSchema,ProgresoLeccionType} from "../schemas/index"
import {handleErrorResponse } from "../utils/errorHandler"

export const getProgresoLeccion = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;  // Página actual (por defecto 1)
        const limit = Number(req.query.limit) || 10; // ProgresoLeccion por página (por defecto 10)

        const ProgresoLeccion = await ProgresoLeccionModel.findMany({
            take: limit,  // Cantidad de ProgresoLeccion por página
            skip: (page - 1) * limit, // Cuántos ProgresoLeccion saltar antes de empezar
        });

        res.status(200).json(ProgresoLeccion);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};


//buscar un ProgresoLeccion por id
export const getProgresoLeccionById = async (req:Request, res:Response) => {
    try{
        //req.params es un objeto que contiene los parámetros de la ruta en este caso contiene el id 
        const { id } = req.params;
        const ProgresoLeccion = await ProgresoLeccionModel.findUnique({
            where: { id: Number(id) },
        });
        if (!ProgresoLeccion) {
            res.status(404).json({ message: "ProgresoLeccion no encontrada" });
        }
        res.status(200).json(ProgresoLeccion);
    }catch(error){
        handleErrorResponse(res, error);
    }   
}

export const createProgresoLeccion = async (req: Request, res: Response) => {
    try {
        // Validar los datos con Zod
        const ProgresoLeccionData: ProgresoLeccionType = ProgresoLeccionSchema.parse(req.body);

        // Crear ProgresoLeccion en la base de datos
        const nuevoProgresoLeccion = await ProgresoLeccionModel.create({
            data: {
                ...ProgresoLeccionData
            },
        });

        res.status(201).json(nuevoProgresoLeccion);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const deleteProgresoLeccion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await ProgresoLeccionModel.delete({
            where: { id: Number(id) },
        });
        // Cambiado a 200 OK con mensaje de confirmación
        res.status(200).json({ 
            message: "ProgresoLeccion eliminado correctamente",
                });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const updateProgresoLeccion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Validar los datos con Zod uso esto Partial<ProgresoLeccionType> para que la validacion sea opcional
        const ProgresoLeccionData: Partial<ProgresoLeccionType> = ProgresoLeccionSchema.partial().parse(req.body);
        
        // Actualizar ProgresoLeccion en la base de datos
        const ProgresoLeccionActualizado = await ProgresoLeccionModel.update({
            where: { id: Number(id) },
            data: ProgresoLeccionData,
        });
        
        res.status(200).json(ProgresoLeccionActualizado);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};