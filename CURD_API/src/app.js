import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import middlewares from './middlewares/index.js';
import empRoutes from './routes/employees/employees.js';


dotenv.config();
const app = express();
const { notFound, errorHandler } = middlewares;

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/api/employees', empRoutes);
app.use(notFound);
app.use(errorHandler);


export default app;