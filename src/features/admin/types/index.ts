export interface User {
  userID: number;
  name: string;
  email: string;
  phone: string;
  roleID: number;
}

export interface Charge {
  chargeID: number;
  description: string;
  amount: number;
  patientId: number;
}

export interface Claim {
  claimID: number;
  description: string;
  status: string;
  payerID: number;
}

export interface Payment {
  paymentID: number;
  amount: number;
  status: string;
  payerID: number;
}

export interface Rule {
  ruleID: number;
  ruleName: string;
  description: string;
}

export interface Notification {
  notificationID: number;
  message: string;
  userId: number;
  isRead: boolean;
}
