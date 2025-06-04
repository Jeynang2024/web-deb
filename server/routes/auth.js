import express from "express";
import bcrypt from "bcrypt";
import pool from "../db.js";
import jwt from 'jsonwebtoken';
import authenticateToken from '../middleware/authenticateToken.js';


const router=express.Router()







router.post("/signup" ,async (req,res)=>{
    const {email,password}=req.body;
  try{
  const userExists= await pool.query("SELECT * FROM newuser WHERE email = $1",[email]);
  if(userExists.rows.length >0 ){
    return res.status(400).json({
        message:"User already exists"
    });
  }
    const hashedPassword= await bcrypt.hash(password,10);
    const newUser=await pool.query(
      "INSERT INTO newuser (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    );
    res.status(201).json({
        message:"User registered successfuly",user:newUser.rows[0]
    })

  
  }catch(err){
    console.log("Error:",err)
    res.status(500).send("server error");
  }


})



router.post("/login",async (req,res)=>{
    const {email,password}=req.body;
try{
    const userExists = await pool.query("SELECT * FROM newuser WHERE email=$1",[email]);
    if(userExists.rows.length===0){
       return  res.status(400).json({
            message: "Invalid credentials" 
        })

    }
    const validPassword=await bcrypt.compare(password,userExists.rows[0].password);
    if(!validPassword){
        return  res.status(400).json({
            message: "Invalid credentials" 
        })
    }
    const token=jwt.sign({ id: userExists.rows[0].id },"helloworld" , {
          expiresIn: "1h",
        });
        res.json({token});

}catch(err){
    console.error("Error here:",err);
    res.status(500).send("sserver error")
}


})

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

export default router;
