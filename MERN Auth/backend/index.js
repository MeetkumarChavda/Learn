import express from 'express';
import dotenv from 'dotenv';
import { connection } from './db/connectDB.js';
import authRoutes from "./routes/auth.route.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.get('/',(req,res)=>{
    res.send('Hello World!');
});

app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(port , ()=>{
    connection();
    console.log(`Server running at http://localhost:${port}`);
})



