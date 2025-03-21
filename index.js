const mongoose = require('mongoose');
const express = require('express');
const { resolve } = require('path');
const schema=require('./schema');
require('dotenv').config();



const mongoUrl = process.env.MONGO_URL;
const app = express();
app.use(express.json());
const port = process.env.PORT;

if(!port || !mongoUrl) {
    console.log('Please set the PORT and MONGO_URL environment variables');
    process.exit(1);
}

app.use(express.static('static'));

mongoose.connect(mongoUrl)
.then(()=>{
  console.log('Connected to the database');
})
.catch((error)=>{
  console.log('Error connecting to the database');
  console.log(error);
});

app.post('/api/users',async(req,res)=>{
  try{
    const user = schema(req.body)
    const savedUser=await user.save();
    res.status(201).json({message:"User saved successfully",user:savedUser});
  }catch(error){
    res.status(400).json({message:"Error saving user",error:error.message});
  }
})
app.get('/api/users', async (req, res) => {
  try {
      const users = await schema.find(); // Fetch all users from the database
      res.status(200).json({ message: "Users retrieved successfully", users: users });
  } catch (error) {
      res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
 