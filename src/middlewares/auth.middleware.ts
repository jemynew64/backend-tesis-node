import {  Response,NextFunction } from "express";

import { verifyToken } from "../utils/jwt";

export const authenticate = (req :any, res:Response, next:NextFunction) =>{
    const token = req.header('Authorization')?.split(' ')[1]

    if(!token){
        res.status(401).json({
            error: 'Access denied. No token provided'
        })
        return;
    }

    try{
        const decoded = verifyToken(token)
        req.user = decoded
        next()
    }catch(error){  
        res.status(403).json({error: 'Invalid or expired token'})
    }
}

