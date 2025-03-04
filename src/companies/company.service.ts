const { connect } = require('../../utils/mongoConnection');

export default class CompanyService {
    private db: any;
    private collection: any;

    private constructor(db: any) {
        this.db = db;
        this.collection = db.collection('companies');
    }

    static async create() {
        const db = await connect();
        return new CompanyService(db);
    }

    async add(cuit: number, razonSocial: string) {
        try {
            return await this.collection.insertOne({
                "CUIT": cuit,
                "Razón Social": razonSocial,
                "Fecha Adhesión": new Date().toISOString()
            });
        } catch (error) {
            console.error("Error al intentar insertar la empresa", error);
            throw error;
        }
    }

    async findByDate(fecha: Date) {
        try {
            return await this.collection.find({
                "Fecha Adhesión": {
                    "$gte": fecha,
                    "$lt": new Date()
                }
            }).toArray();
        } catch (error) {
            console.error("Error al buscar empresas por fecha:", error);
            throw error;
        }
    }

    async findLastMonth() {
        try {
            let fechaActual = new Date();
            fechaActual.setMonth(fechaActual.getMonth() - 1);
            return await this.findByDate(new Date(fechaActual.toISOString()));
        } catch (error) {
            console.error("Error al buscar empresas por fecha:", error);
            throw error;
        }
    }

    async findLastMonthlyTransfers() {
        try {

            return await this.collection.aggregate([
                {
                    $lookup: {
                        from: 'transfers',
                        localField: '_id',
                        foreignField: 'idEmpresa',
                        as: 'transferencias'
                    }
                },
                {
                    $unwind: {
                        path: "$transferencias",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $match: {
                        "transferencias.fecha": { $gte: new Date(new Date(new Date().setMonth(new Date().getMonth() - 1))) }
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        cuit: { $first: "$CUIT" },
                        razonSocial: { $first: "$Razón Social" },
                        transferencias: { $push: "$transferencias.fecha" }
                    }
                }
            ]).toArray();
        } catch (error) {
            console.error();
            throw error;
        }
    }
}