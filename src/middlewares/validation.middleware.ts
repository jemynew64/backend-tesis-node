import { ZodError } from "zod";
import { Request, Response,NextFunction } from "express";

export const validate = (schema:any) => (req:Request, res:Response, next:NextFunction) => {
    try {
        // Valida el cuerpo de la solicitud
        schema.parse(req.body);
        next(); // Si pasa la validación, pasa al siguiente middleware o controlador
    } catch (error) {
        if (error instanceof ZodError) {
            const errors = error.errors.map((err) => ({
                field: err.path[0],
                message: err.message,
            }));
            return res.status(400).json({ errors });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
};