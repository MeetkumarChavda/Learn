import jwt from 'jsonwebtoken';

export const verifyToken = (req,res,next)=>{
    const token = req.cookies.token // token is our token name 
    // to get this nee a cookie-parser
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Unauthorized - no token provided"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRATE)
        if(!decoded){
            return res.status(401).json({
                success:false,
                message:"Unauthorized- invalid token"
            })
        }
        req.userId = decoded.userID;
        next();

    } catch (error) {
        console.log("Error in verifyToken" , error);
        return res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}