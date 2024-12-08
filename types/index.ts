export type Item = {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    externalLink?: string | null;
    qrCode?: string;
    upiId?: string;
  };
  
  export type Contribution = {
    name: string;
    amount: number;
    itemName: string;
    contributionId: string;
  };
  