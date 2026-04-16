// OCRacle — User Types

export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  isPremium: boolean;
  premiumExpiresAt?: string;
  createdAt: string;
}

export interface ImpactStats {
  plasticAvoided: number;    // kg
  co2Saved: number;          // tonnes
  waterConserved: number;    // litres
  productsSwitched: number;  // count
  moneySaved: number;        // INR
  totalScans: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  endsAt: string;
  badgeReward?: Badge;
}
