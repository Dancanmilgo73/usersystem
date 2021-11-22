require("dotenv").config();
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

async function Authenticator(req, res, next){
    const authHeader= req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    // JWT.verify(token, process.env.ACCESS_TOKEN, (err, {email, password, user})=>{
    //   if(err) return res.sendStatus(403);
    //    req.body.email = email;
    //  console.log(req.body)
    const result = await JWT.verify(token, process.env.SECRET_KEY)
    req.body.email = result.email
    // console.log("hapa:", result)
      // console.log(email, password, user);
      next();
    // })
  }


  module.exports ={Authenticator}