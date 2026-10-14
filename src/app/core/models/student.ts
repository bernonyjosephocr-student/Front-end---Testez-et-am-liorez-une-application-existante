export interface Student {
  id?: number;
  cardNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  homeAddress: string;
  membershipType: MembershipType;
  studentCardNumber: string;
  studentCardExpiryDate: string;
  membershipExpiryDate: string;
  accountStatus: AccountStatus;
  createdAt?: string;
}

export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type MembershipType = 'Standard' | 'Premium' | 'VIP';