export interface Fragrance {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  label: string;
  type: string;
  shortDesc: string;
  desc: string;
  image: string;
  notes: {
    top: string;
    heart: string;
    base: string;
  };
  sillage: string;
  occasion: string;
  sensation: string;
  presentation: string;
  duration: string;
}

export interface Review {
  name: string;
  text: string;
  stars: number;
}

export interface Country {
  id: string;
  name: string;
  dialCode: string;
  currency: string;
  flag: string;
  rate: number;
  symbol: string;
  fields: { id: string; label: string; placeholder: string; required?: boolean }[];
}

export interface OrderData {
  product: string;
  price: string;
  country: string;
  profileName?: string;
  protagonists?: string[];
  name: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  reference: string;
  locationDetails: Record<string, string>;
  paymentMethod: string;
}
