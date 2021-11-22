require("dotenv").config();
const mssql = require('mssql')
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { sqlConfig } = require('../config/db');


const loginUser = async(req,res) => {
    const { email, password } = req.body;
    try {
        
        if (email && password) {
        let sql = `SELECT * FROM users WHERE email = '${email}'`;
     
        const pool = await mssql.connect(sqlConfig);
        const data = await pool.request().query(sql);
        const user = data.recordset[0];
        if (!user) res.status(401).send({message: "User not found"});
             bcrypt.compare(password, user.password, (err, result) => {
                if(err) return res.status(401).send({message: err.message});
              if (!result) return res.status(401).send({message: "Wrong credentials"});
      
              const token = JWT.sign(
                { user: user.username, password: user.password, email: user.email },
                process.env.SECRET_KEY,
                { expiresIn: "1h" }
              );
              return res.json({ accessToken: token });
            });
        
      };
         
    
    
        
    } catch (error) {
       
        return res.status(500).send({message: erroe.message})
    }
} 


const registerUser = async(req,res) =>{
  function checkPasswordStrength(password) {
    const checkForLength = new RegExp("^(?=.{8,})");
    const checkForSymbols = new RegExp("^(?=.*[!@#$%^&*])");
    const checkForCapsLettersNumbers = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"
    );
    if (!checkForLength.test(password))
       res.status(401).send({message: "Password must be atleast 8 characters long "});

    if (!checkForSymbols.test(password))
       res.status(401).send({message: "Password must contain atleast 1 symbol"});

    if (!checkForCapsLettersNumbers.test(password))
     res
        .status(401)
        .send({message: "Password must contain small, letters caps and numbers"});
  }
   
  try {
    const { email, username, password, confirmPassword } = req.body;
    if (!email || !username || !password || !confirmPassword)
       return res.status(401).send({message: "fill in all credentials"});

    if (password !== confirmPassword)
       return res.status(401).send({message: "Confirm password do not match"});
      checkPasswordStrength(password);
    const hashedPassword = await bcrypt.hash(password, 10).catch(err=> console.log(err));
    const user = { email, name: username, password: hashedPassword };
    let sql = `INSERT INTO users(username, email, password) values('${user.name}', '${user.email}', '${user.password}')`;
    const pool = await mssql.connect(sqlConfig).catch(err=> console.log(err));
    const result = await pool.request().query(sql).catch(err=> res.status(401).send({message: "email already in use"}));

     return res.status(201).send(result);


  
    } catch (err) {
       return res.status(500).send("erro");
    }


    
}

const addProject = async(req,res) => {
    try {
    const {project,email} =req.body;
    // console.log(email);
    // console.log(project);
     let sql = `UPDATE users SET project = '${project}' WHERE email = '${email}'`;
     const pool = await mssql.connect(sqlConfig);
     const result = await pool.request().query(sql)
    //  console.log(result)
    return
    } catch (error) {
        res.status(500).send();
    }
}

const removeProject = async(req,res) => {
  try {
  const {project,email} =req.body;
  console.log(email);
  // console.log(project);
   let sql = `UPDATE users SET project = NULL WHERE email = '${email}'`;
   const pool = await mssql.connect(sqlConfig);
   const result = await pool.request().query(sql)
   console.log(result)
  } catch (error) {
      return res.status(500).send();
  }
}


module.exports ={loginUser, registerUser, addProject, removeProject}


