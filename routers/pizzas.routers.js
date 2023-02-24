import express from 'express'
// import { auth } from "../middleware/auth.js"
// import nodemailer from "nodemailer"
import {
    getMenubyId,
    getMenu,
    updateMenubyId,
    addMenubyId,
    DeleteMenu,
} from '../service/pizzas.service.js'
import * as dotenv from 'dotenv'
import { auth } from '../middleware/auth.js'
dotenv.config()
const router = express.Router()


router.get('/menu', auth , async function (request, response) {
    const result = await getMenu()
    response.send(result);
})

router.get('/menu/:id',auth, async function (request, response) {
    const { id } = request.params;
    const result = await getMenubyId(id)
    response.send(result);
})

router.put('/menu/:id', async function (request, response) {
    const { id } = request.params;
    const data = request.body;
    const result = await updateMenubyId(id, data)
    response.send(result);
})

router.post("/add/menu", async function (request, response) {
    const data = request.body
    const result = await addMenubyId(data)
    response.send(result)
})
router.post("/menu/send/", auth, async function(request,response){
    const { email, name, quantity, total} = request.body
    const mailOptions = {
      from:process.env.EMAIL,
      to:email,
      subject:"Sending Mail Regarding Tickets",
      text:`
      Hi ${name},
      You Ordered Some Items from Our Shop and Your Quantity is ${quantity} and the Total is ${total} Payment is Successfull and Your Delivery expected in 03/03/2023`
     }
     
     transporter.sendMail(mailOptions,(error,info) => {
      if(error){
        console.log("error",error)
      }else{
        console.log('Email Sent Successfully', info.response)
        response.status(201).json({status:201,info})
      }
     })
  
    })

router.delete("/menu/:id", async function (request, response) {
    const { id } = request.params;
    const result = await DeleteMenu(id);
    console.log(result);
    result.deletedCount > 0 ? response.send({ msg: 'Movie was deleted successfully' }) : response.status(404).send({ msg: "MovieNot Found" });
});

export default router