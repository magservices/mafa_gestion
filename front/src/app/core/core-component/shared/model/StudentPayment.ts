export class StudentPayment {
  id!: number;
  totalAnnualCosts!: number;
  paymentReason!: string;
  paymentStatus!: string;
  fees!: boolean; // frais d'inscription ou d'autres frais qui ne font pas partie du frais mensuel
  amount!: number;
  month!: string;
}
