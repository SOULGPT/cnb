export interface StoreSettings {
  restaurantName: string;
  address: string;
  phone: string;
  pIva: string;
  logoUrl: string | null;
  footerMessage: string;
  specialAnnouncement: string | null;
  fees: {
    copertoPerPerson: number;
    deliveryCharge: number;
    enableCoperto: boolean;
  };
  ivaRates: {
    food: number;
    drinks: number;
    delivery: number;
  };
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  restaurantName: "Curry & Burger",
  address: "Via XYZ, Porto Recanati (MC), 62017",
  phone: "+39 333 36386399",
  pIva: "02167740436",
  logoUrl: "/logo.png",
  footerMessage: "Grazie per la visita! A presto / See you again!",
  specialAnnouncement: "Seguici su Instagram @CurryAndBurger",
  fees: {
    copertoPerPerson: 1.50,
    deliveryCharge: 2.50,
    enableCoperto: false,
  },
  ivaRates: {
    food: 0.10,
    drinks: 0.22,
    delivery: 0.22,
  },
};
