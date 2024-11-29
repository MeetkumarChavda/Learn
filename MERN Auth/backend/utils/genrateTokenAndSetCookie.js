import jwt from 'jsonwebtoken';

export const genrateTokenAndSetCookie = (res , userID) =>{
    const token = jwt.sign({userID}, process.env.JWT_SECRATE, {
        expiresIn: '7d'
    })

    res.cookie('token',token, {
        httpOnly: true,
        secure:process.env.NODE_ENV === "production" ,
        samesite:"strict" ,//csrf
        maxAge: 7*24*60*60*1000,
    });

    return token;
};