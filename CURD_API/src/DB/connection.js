import monk from "monk";
import dotenv from 'dotenv';
dotenv.config(); 

let dbUrl = process.env.DB_URL;

if (process.env.NODE_ENV === 'test') {
  dbUrl = process.env.TEST_DB_URL;
}

const db = monk(dbUrl);

export default db;