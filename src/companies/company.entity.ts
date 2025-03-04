interface ICompany {
  cuit: number;
  razonSocial: string;
  fechaAdhesion: Date;
}

export default class Company implements ICompany {
  cuit: number;
  razonSocial: string;
  fechaAdhesion: Date;

  constructor({ cuit, razonSocial, fechaAdhesion }: ICompany) {
    this.cuit = cuit;
    this.razonSocial = razonSocial;
    this.fechaAdhesion = fechaAdhesion;
  }
}