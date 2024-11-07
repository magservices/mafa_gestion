export interface Establishment {
  id?: number;  // L'ID peut être optionnel pour les nouveaux établissements
  name: string;
  address: string;
  phone: string;
  subscriptionType: string;
  modalType: string;
  accessKey: string;
  price: number;
  month: number;
  createAt: Date;
  expiryDate: Date;
}
