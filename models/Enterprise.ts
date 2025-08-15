export interface Entreprise {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
}


export interface EnterpriseForm {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
}

export const defaultEnterpriseFormData = (): EnterpriseForm => ({
  id: "",
  name: "",
  address: "",
  email: "",
  phone: "",
});