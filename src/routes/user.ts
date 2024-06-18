import { Router } from "express";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { prisma } from "../infra/prisma";

const JWT_SECRET = process.env.JWT_SECRET!
const router = Router()


router.post('/signup', async  (req, res) => {

    const {email, password, name} = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const user = await prisma.user.create({
            data: {
                email, 
                password: hashedPassword, 
                name
            }
        })

        res.status(201).json(user)
    } catch(error) {
        res.status(400).json({error: "Email already exists"})
    }


})

router.post('/signin', async(req, res) => {
    const {email, password} = req.body

    const user = await prisma.user.findUnique({
        where: {email}
    })

    if(!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({error: 'Invalid credentials'})
    }
    const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '1h'})

    res.json({token: token, email: user.email})


})


export default router