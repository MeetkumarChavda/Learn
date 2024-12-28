import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import monk from 'monk';

dotenv.config();

const app = express();
const port  = process.env.PORT || 5000;

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());


app.listen( port, () =>{
    console.log(`Server is running on port ${port}`);
})



