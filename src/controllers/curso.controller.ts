import { Request, Response } from "express";
import {CursoModel} from "../database/prismaClient"
import {CursoSchema,CursoType} from "../schemas/index"
import {handleErrorResponse } from "../utils/errorHandler"

export const getCurso = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;  // Página actual (por defecto 1)
        const limit = Number(req.query.limit) || 10; // Curso por página (por defecto 10)

        const Curso = await CursoModel.findMany({
            take: limit,  // Cantidad de Curso por página
            skip: (page - 1) * limit, // Cuántos Curso saltar antes de empezar
        });

        res.status(200).json(Curso);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};


//buscar un Curso por id
export const getCursoById = async (req:Request, res:Response) => {
    try{
        //req.params es un objeto que contiene los parámetros de la ruta en este caso contiene el id 
        const { id } = req.params;
        const Curso = await CursoModel.findUnique({
            where: { id: Number(id) },
        });
        if (!Curso) {
            res.status(404).json({ message: "Curso no encontrado" });
        }
        res.status(200).json(Curso);
    }catch(error){
        handleErrorResponse(res, error);
    }   
}

export const createCurso = async (req: Request, res: Response) => {
    try {
        // Validar los datos con Zod
        const CursoData: CursoType = CursoSchema.parse(req.body);

        // Crear Curso en la base de datos
        const nuevoCurso = await CursoModel.create({
            data: {
                ...CursoData
            },
        });

        res.status(201).json(nuevoCurso);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const deleteCurso = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await CursoModel.delete({
            where: { id: Number(id) },
        });
        // Cambiado a 200 OK con mensaje de confirmación
        res.status(200).json({ 
            message: "Curso eliminado correctamente",
                });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const updateCurso = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Validar los datos con Zod uso esto Partial<CursoType> para que la validacion sea opcional
        const CursoData: Partial<CursoType> = CursoSchema.partial().parse(req.body);
        
        // Actualizar Curso en la base de datos
        const CursoActualizado = await CursoModel.update({
            where: { id: Number(id) },
            data: CursoData,
        });
        
        res.status(200).json(CursoActualizado);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};