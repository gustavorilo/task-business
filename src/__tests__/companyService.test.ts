import CompanyService from '../companies/company.service';
import {connect} from '../../utils/mongoConnection';

// Mockear la conexión a MongoDB
jest.mock('../../utils/mongoConnection');

describe('CompanyService', () => {
  let companyService: CompanyService;
  let mockCollection: any;

  beforeAll(async () => {
    // Mock de la base de datos
    mockCollection = {
      insertOne: jest.fn(),
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn(),
      aggregate: jest.fn().mockReturnThis(),
    };

    // Simulamos la función connect para devolver una colección mock
    (connect as jest.Mock).mockResolvedValue({ collection: () => mockCollection });
    
    // Inicializamos el servicio
    companyService = await CompanyService.create();
  });

  beforeEach(() => {
    // Limpiar los mocks antes de cada prueba
    mockCollection.insertOne.mockClear();
    mockCollection.find.mockClear();
    mockCollection.toArray.mockClear();
    mockCollection.aggregate.mockClear();
  });

  describe('add()', () => {
    it('debería insertar una empresa correctamente', async () => {
      // Datos de prueba
      const cuit = 20223344556;
      const razonSocial = 'Empresa Test';
      
      // Configurar el mock de insertOne
      mockCollection.insertOne.mockResolvedValue({ insertedId: '12345' });

      const result = await companyService.add(cuit, razonSocial);

      // Verificar que insertOne fue llamado con los datos correctos
      expect(mockCollection.insertOne).toHaveBeenCalledWith({
        "CUIT": cuit,
        "Razón Social": razonSocial,
        "Fecha Adhesión": expect.any(String), // Puede ser cualquier fecha en formato ISO
      });

      // Verificar que el resultado sea el esperado (en este caso solo estamos mockeando la llamada, no la respuesta real)
      expect(result).toEqual({ insertedId: '12345' });
    });
  });

  describe('findLastMonthlyTransfers()', () => {
    it('debería encontrar empresas con transferencias del último mes', async () => {
      // Mock del resultado de la consulta de agregación
      mockCollection.aggregate.mockResolvedValue([
        { cuit: 20223344556, razonSocial: 'Empresa Test', transferencias: ['2025-02-01'] }
      ]);

      const result = await companyService.findLastMonthlyTransfers();

      // Verificar que aggregate fue llamado
      expect(mockCollection.aggregate).toHaveBeenCalledWith([
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
      ]);

      expect(result).toEqual([
        { cuit: 20223344556, razonSocial: 'Empresa Test', transferencias: ['2025-02-01'] }
      ]);
    });
  });
});
