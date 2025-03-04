import { Router } from 'express';
import CompanyService from './company.service';

const companyRouter = Router();


companyRouter.post('/add', async (req, res) => {
    
    try {
        const { cuit = '', razonSocial = '' } = req.body;
        const service = await CompanyService.create();

        const companies = await service.add(cuit, razonSocial);
        res.status(200).json({ message: `Empresa insertada con éxito` });
    } catch(error) {
        console.error(error);
    }
});

companyRouter.get('/lastmonthmembers', async (req, res) => {

    try {
        const service = await CompanyService.create();
        const companies = await service.findLastMonth();
        res.json({
            companies,
            message: `(${ companies.length }) Empresas que se adhirieron el último mes.`
        });
    } catch (error) {
        console.error(error);
    }
});

companyRouter.get('/lastmonthlytransfers', async (req, res) => {
    
    try {
        const service = await CompanyService.create();
        const companies = await service.findLastMonthlyTransfers();
        res.json({
            companies,
            messsage: `(${companies.length}) Empresas que realizaron transferencias el último mes.`
        });
    } catch(error) {
        console.error(error);
    }
});

export default companyRouter;

