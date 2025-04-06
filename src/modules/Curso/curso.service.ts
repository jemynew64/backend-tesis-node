// curso.service.ts
import { CursoModel } from "../../database/prismaClient";
import { CursoSchema, CursoType } from "../../schemas/index";

// Paginado
export const getAllCursos = async (page: number, limit: number) => {
    return await CursoModel.findMany({
        take: limit,
        skip: (page - 1) * limit,
    });
};

export const getCursoByIdService = async (id: number) => {
    return await CursoModel.findUnique({ where: { id } });
};

export const createCursoService = async (data: CursoType) => {
    const validData = CursoSchema.parse(data);
    return await CursoModel.create({ data: validData });
};

export const deleteCursoService = async (id: number) => {
    return await CursoModel.delete({ where: { id } });
};

export const updateCursoService = async (id: number, data: Partial<CursoType>) => {
    const validData = CursoSchema.partial().parse(data);
    return await CursoModel.update({
        where: { id },
        data: validData,
    });
};
