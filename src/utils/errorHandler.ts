export class ApiError extends Error {
    statusCode: number;
  
    constructor(statusCode: number, message: string) {
      super(message);
      this.statusCode = statusCode;
      this.name = "ApiError";
    }
  }
  
import { Response } from "express";

export const handleErrorResponse = (res: Response, error: unknown): Response => {
    console.error(error);
  
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
  
    // Captura errores de validaciones Zod
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ 
        message: "Error de validación",
        errors: (error as any).issues // ZodError tiene issues
      });
    }
  
    // Cualquier otro error desconocido
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ message: errorMessage });
  };