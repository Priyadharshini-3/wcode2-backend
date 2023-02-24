import express from "express";
import nodemailer from "nodemailer"
import { CreateUsers, getUserByName } from "../service/users.service.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
// import { auth } from "../middleware/auth.js";
const router = express.Router()

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:process.env.EMAIL,
      pass:process.env.PASSWORD,
    }
  })
  
async function getHashedPassword(password) {
    const No_of_Rounds = 10;
    const salt = await bcrypt.genSalt(No_of_Rounds);
    const hashedPassword = await bcrypt.hash(password, salt)
    console.log(salt);
    console.log(hashedPassword)
    return hashedPassword
}

// post
router.post("/signup", async function (request, response) {
    const { username, password, email, phone } = request.body;
    const userFromDB = await getUserByName(username)
    console.log(userFromDB)
    if (userFromDB) {
        response.status(400).send({ message: "Username already exists" })
    } else if (password.length < 8) {
        response.status(400).send({ message: "Password must be atleast 8 characters" })
    } else {
        const hashPassword = await getHashedPassword(password)
        console.log(hashPassword, password)
        const result = await CreateUsers({
            username: username,
            password: hashPassword,
            email: email,
            phone: phone,
        })
        response.send(result)
    }
});


router.post("/login", async function (request, response) {
    const { username, password } = request.body;
    const userFromDB = await getUserByName(username)
    console.log(userFromDB)
    if (!userFromDB) {
        response.status(400).send({ message: "Invalid Credentiales" })
    } else {
        const storedDBPassword = await userFromDB.password
        const isPaswordMatch = await bcrypt.compare(password, storedDBPassword)
        console.log(isPaswordMatch)
        if (isPaswordMatch) {
            const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY)
            response.send({ message: "Successful login 🎊🎊", token: token })
        } else {
            response.status(401).send({ message: "Invalid Crudentiales" })
        }
    }
});
router.get('/getDetails/:email', async function(request,response){
    let {email} = request.params
    console.log(request.params)
    const result = await getUserByEmail(email);
    console.log(result)
    response.send(result)
  })


export default router;


