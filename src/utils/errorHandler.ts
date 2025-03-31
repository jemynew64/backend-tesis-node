import { Response } from "express";
export const handleErrorResponse = (res:Response, error:unknown) => {
    console.error(error);
    // Verifica si el error es una instancia de Error
     const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
     res.status(500).json({ error: errorMessage });
};