import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors' ;
import { connection } from './db/connectDB.js';
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.get('/',(req,res)=>{
    res.send('Hello World!');
});

app.use(express.json()); // allows us to parse incoming requests: req.body
app.use(cookieParser()); // allows us to parse incoming cookies
app.use(cors({origin: "http://localhost:5173" , credentials:true}));
app.use('/api/auth', authRoutes);

app.listen(port , ()=>{
    connection();
    console.log(`Server running at http://localhost:${port}`);
})



