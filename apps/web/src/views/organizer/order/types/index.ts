export interface TransactionItems {
  id: number;
  payerId: number;
  paidAmount: number;
  createdAt: Date;
  status: TransactionStatus;
  payer: {
    email: string;
    id: number;
  };
}

enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}
