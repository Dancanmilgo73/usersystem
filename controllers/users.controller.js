
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
        if (!user) res.status(401).send("User not found");
            bcrypt.compare(password, user.password, (err, result) => {
                if(err) console.log(err.message);
              if (!result) res.status(401).send("Wrong credentials");
      
              const token = JWT.sign(
                { user: user.username, password: user.password, email: user.email },
                process.env.ACCESS_TOKEN,
                { expiresIn: "1h" }
              );
              res.json({ accessToken: token });
            });
        
      };
         
    
    
        
    } catch (error) {
       
        
    }
} 


const registerUser = async(req,res) =>{
   
        const { email, username, password, confirmPassword } = req.body;
  try {
    if (!email || !username || !password || !confirmPassword)
      res.status(401).send("fill in all credentials");

    if (password !== confirmPassword)
      res.status(401).send("Confirm password do not match");
      checkPasswordStrength(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, name: username, password: hashedPassword };
    let sql = `INSERT INTO users(username, email, password) values('${user.name}', '${user.email}', '${user.password}')`;
    const pool = await mssql.connect(sqlConfig);
    const result = await pool.request().query(sql);

    res.status(201).send("User was added");
    } catch (error) {
        res.status(500).send();
    }


    function checkPasswordStrength(password) {
        const checkForLength = new RegExp("^(?=.{8,})");
        const checkForSymbols = new RegExp("^(?=.*[!@#$%^&*])");
        const checkForCapsLettersNumbers = new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"
        );
        if (!checkForLength.test(password))
          res.status(401).send("Password must be atleast 8 characters long ");
    
        if (!checkForSymbols.test(password))
          res.status(401).send("Password must contain atleast 1 symbol");
    
        if (!checkForCapsLettersNumbers.test(password))
          res
            .status(401)
            .send("Password must contain small, letters caps and numbers");
      }
}

const addProject = async(req,res) => {
    try {
    const {project,email} =req.body;
    console.log(email);
    console.log(project);
     let sql = `UPDATE users SET project = '${project}' WHERE email = '${email}'`;
     const pool = await mssql.connect(sqlConfig);
     const result = await pool.request().query(sql)
     console.log(result)
    } catch (error) {
        res.status(500).send();
    }
}

module.exports ={loginUser, registerUser, addProject}


