const JWT = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {

    try{
        const token = req.body.token;

        if(!token){
            return res.status(401).json({
                status:false,
                message:"Token not found."
            });
        }

        const user = JWT.verify(token, process.env.JWT_SECRET);

        if(!user){
            return res.status(401).json({
                status:false,
                message:"Error in token."
            });
        }

        console.log(user);
        req.user = user;

        next();

    }catch(error){
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while authorizing token of the user."
        })
    }
}


exports.isStudent = async (req, res, next) => {
    try{

        if(req.user.role !== "Student"){
            return res.status(401).json({
                success: false,
                message: `${req.user.role} cannot enter the student protectd route.`
            })
        }

        next();

    }catch(error){
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while checking role of the user."
        })
    }
};


exports.isAdmin = async (req, res, next) => {
    try{

        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success: false,
                message: `${req.user.role} cannot enter the admin protectd route.`
            })
        }

        next();

    }catch(error){
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while checking role of the user."
        })
    }
};