export interface UserProfile {
  userId: string;
  walletAddress?: string;
  email?: string;
  isDemo: boolean;
  createdDateUTC: number;
}
