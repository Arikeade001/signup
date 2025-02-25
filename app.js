// const express =require("express");

// const app = express();


// app.get("/", (req, res)=> {
//     res.send("Hello, World!");
// })


// app.get("/profile", (req, res)=> {
//     res.send("My Profile");
// })

// app.listen(3000,()=> {
//     console.log("server is running on port 3000");
// })



const express =require("express");

const app = express();
const env =require("dotenv");
env.config();
const mongoose = require ("mongoose");
const port = process.env.PORT=4000;
const bcrypt = require("bcrypt");

app.use(express.json())

const connectDB = async ()=> {
    try{
       await mongoose .connect("mongodb://localhost:27017/empower") 
       console.log("mongoDB connected...");
    }catch (error){
        console.log ("error connecting to the database");
    }
}
connectDB();
 
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    }, 
    lastName: {
        type: String,
        required: true
    }, 
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type: String,
        required:  true,
        minlength: 5
    },
    reason : {
        type: String,
        required: true
    }
})

 
const User = mongoose.model("User", userSchema);
app.post ("/signup", async (req, res)=>{
    try{
       const{firstName, lastName, phoneNumber,email,password,reason}= req.body;
       const existinguser= await User.findOne({email: email});
       if(existinguser){
        return res.status(400).json({msg:"user already exist"});
       } 

       const hashedpassword = await bcrypt.hash(password,10)
       const newuser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedpassword,
       })
       await newuser.save();
       return res.status(200).json({msg :"user created successfully please log in"})
    } catch (error){
        console.log(error);
        return res.status(200).json({msg:"internal server errornpm run"})
    }
})


app.post("/login", async (req, res) => {
    try{
    const {email, password} = req.body
      
    if(!email  || !password){
        return res.status.apply(400).json({message: "All filies are required"});
    }
    const user = await User.findOne({email: email});

    if(!user){
        return res.status(400).json ({message: " user not found"});
    }
    const compare = await bcrypt.compare(password, user.password)
    if(!compare){
        return res.status(400).json({message: "incorrect password"});
    }
    return res.status(200).json({message: "user logged in successfully"});
 } catch(err){
    return res.status(500).json({message: "internal server error" })
 }
})

app.get("/allData", (req, res)=> {
    User.find({}, (err, users)=>{
        if(err){
            return res.status(400).json({msg: "Error getting data"});
        }
        res.json(users);
    })
})

app.get("/number-of-appplicats", (req, res)=> {
    User.countDocuments({}, (err, count)=>{
        if(err){
            return res.status(400).json({msg: "Error getting data"});
        }
        res.json({count: count});
    })
})

app.get("/", (req, res)=> {
    res.send("Welcome to laptop4dev");

}) 

app.listen(4000,()=> {
    console.log("server is running on port 4000");
})