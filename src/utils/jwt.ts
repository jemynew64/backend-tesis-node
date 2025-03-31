import jwt from 'jsonwebtoken'

//* Generate jwt token
export const generateToken = (payload:any) =>{
    const secret = process.env.JWT_SECRET || 'defaultSecret';
    const options: jwt.SignOptions = { expiresIn: 6 * 60 * 60 }; // 6 horas
    return jwt.sign(payload, secret, options);
}

//* Verify jwt token
export const verifyToken = (token:any) => {
    const secret = process.env.JWT_SECRET || 'defaultSecret';
    try{
        return jwt.verify(token, secret)
    }catch(error){
        throw new Error('Token no valido')
    }
}

//* Optional
export const decodeToken = (token:any) =>{
    return jwt.decode(token)
}

