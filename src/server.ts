import express, {Express} from "express";

import dotenv from 'dotenv';
import router from "./routes/user";




const app: Express = express()
const port = 3000


dotenv.config();
app.use(express.json())


app.use(router)

app.listen(port, () => {
    console.log("Server is running", port)
})