import { Request, Response } from "express";
import { LeccionModel, UnidadModel } from "../database/prismaClient";
import { LeccionSchema, LeccionType } from "../schemas/index";
import { handleErrorResponse } from "../utils/errorHandler";

export const getLeccion = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const lecciones = await LeccionModel.findMany({
            include: {
                unidad: {
                    select: {
                        titulo: true
                    }
                }
            },
            take: limit,
            skip: (page - 1) * limit,
            orderBy: {
                orden: 'asc'
            }
        });

        res.status(200).json(lecciones);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// export const getLeccionesByUnidad = async (req: Request, res: Response) => {
//     try {
//         const { unidadId } = req.params;
        
//         // Verificar si la unidad existe
//         const unidadExists = await UnidadModel.findUnique({
//             where: { id: Number(unidadId) }
//         });

//         if (!unidadExists) {
//              res.status(404).json({ message: "Unidad no encontrada" });
//         }

//         const lecciones = await LeccionModel.findMany({
//             where: { unidad_id: Number(unidadId) },
//             orderBy: { orden: 'asc' },
//             select: {
//                 id: true,
//                 titulo: true,
//                 orden: true,
//                 unidad_id: true
//             }
//         });

//         res.status(200).json({
//             unidad: {
//                 id: unidadExists.id,
//                 nombre: unidadExists.titulo
//             },
//             lecciones
//         });
//     } catch (error) {
//         handleErrorResponse(res, error);
//     }
// };


export const getLeccionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const leccion = await LeccionModel.findUnique({
            where: { id: Number(id) },
            include: {
                unidad: {
                    select: {
                        id: true,
                        titulo: true
                    }
                }
            }
        });

        if (!leccion) {
            res.status(404).json({ message: "Lección no encontrada" });
        }

        res.status(200).json(leccion);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const createLeccion = async (req: Request, res: Response) => {
    try {
        // Validar datos con Zod
        const leccionData: LeccionType = LeccionSchema.parse(req.body);

        const nuevaLeccion = await LeccionModel.create({
            data: leccionData
        });

        res.status(201).json(nuevaLeccion);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const updateLeccion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const leccionData: Partial<LeccionType> = LeccionSchema.partial().parse(req.body);

        const leccionActualizada = await LeccionModel.update({
            where: { id: Number(id) },
            data: leccionData
        });

        res.status(200).json(leccionActualizada);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const deleteLeccion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await LeccionModel.delete({
            where: { id: Number(id) }
        });

        res.status(200).json({ 
            message: "Lección eliminada correctamente",
        });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};