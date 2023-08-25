const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/auth");

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const UserModel = mongoose.model("users", UserSchema);

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const encryptPassword = bcrypt.hashSync(password, 10);
    try{
        const existingUser = await UserModel.findOne({ email: email });

        if (existingUser) {
            console.log("Already registered");
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        const user = new UserModel({ name: name, email: email, password: encryptPassword });
        await user.save();

        res.status(200).json({ message: 'User registered' });
        console.log('User registered');
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

app.post('/login', async(req, res)=>{
    const {email, pass} = req.body;
    const match = await UserModel.findOne({email : email});
    if(match){
        console.log('Matched');
        const isMatch = await bcrypt.compare(pass, match.password);
        if(isMatch){
            res.json({result: 1});
        }
        else{
            res.json({result: "Wrong Password"});
        }
    }
    else{
        console.log('Not Matched');
        res.json({result: "User not found"});
    }
})
app.listen(3001, () => {
    console.log("Server is running....");
});
