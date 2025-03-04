import express from 'express';
import companyRouter from './companies/company.controller';
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT,
    SERVER_HOST = process.env.SERVER_HOST,
    SERVER_PORT = process.env.SERVER_PORT;

app.use(express.json());
app.use('/companies', companyRouter);


app.listen(SERVER_PORT, () => {
  console.log(`🔥 Servidor corriendo en ${SERVER_HOST}:${SERVER_PORT}`);
});