const User = require ("../models/user");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

exports.signUp = async (req, res) => {

    try{

        const {name, email, password, role} = req.body;
        const existedUser = await User.findOne({email});

        if(existedUser){
            return res.status(400).json({
                status: false,
                message: "The email id is already registered."
            });
        }

        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }catch(error){
            console.log("Unable to hash the password.");
            return res.status(400).json({
                status:false,
                message:"Unable to hash the password."
            });
        }

        const user = await User.create({
            name, email, password:hashedPassword, role
        });

        res.status(200).json({
            status: true,
            data: user,
            message: "User created Successsfully!"
        });

    }catch(error){

        console.error(error);
        console.log("Error while creatingthe user.");
        res.status(500)
        .json({
            success: false,
            error: error.message,
            message: "Unable to save the user. Internal Server Error !"
        });
    }
}

exports.signIn = async (req, res) => {

    try{

        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message:"Please Fill all the details carefully!"
            });
        }

        let user = await User.findOne({email});


        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not registered with us."
            });
        }

        if(await bcrypt.compare(password, user.password)){
            //Password and email matches with the one in the db

            const payload ={
                id: user._id,
                email: user.email,
                role: user.role
            }

            let token = JWT.sign(payload,
                                process.env.JWT_Secret,
                                {
                                    expiresIn: '2h'
                                });
            user = user.toObject();
            user.token = token;
            user.password = undefined;
            const options = {
                expiresIn : new Date(Date.now() + 3*24*60*60*1000), //in milliseconds
                httpOnly : true
            };

            res.cookie('token', token, options).status(200).json({
                success: true,
                token,
                user,
                message:"User successfully signed In."
            })
        }else{
            //pasword did not match
            return res.status(401).json({
                success: false,
                message: "The mail id and password did not match."
            });
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message:"Error in logging in the user."
        });
    }
};