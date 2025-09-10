import type { Offer } from "./Offer";

export interface Entreprise {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  offersCount: number;
  offers: Offer[];
}

export const defaultEntreprise = () => ({
  id: "",
  name: "",
  address: "",
  email: "",
  phone: "",
  offersCount: 0,
  offers: [] as Offer[]
})


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