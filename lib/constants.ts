import type { LoyaltyTierInfo, CustomOption, FriesOption } from "@/types"

export const LOYALTY_TIERS: LoyaltyTierInfo[] = [
  {
    name: "Classic",
    minPoints: 0,
    benefits: ["Earn 1 point per €1", "Birthday surprise"],
    color: "#6B6B6B",
  },
  {
    name: "Gold",
    minPoints: 500,
    benefits: ["Earn 1.5 points per €1", "Priority support", "Exclusive deals"],
    color: "#E78A00",
  },
  {
    name: "Platinum",
    minPoints: 1500,
    benefits: ["Earn 2 points per €1", "Free delivery", "VIP events", "Special gifts"],
    color: "#7B1E2D",
  },
]

export const POINTS_PER_EURO = 1
export const REDEEM_RATE = 100 // 100 points = €1 discount

export const ORDER_STATUS_LABELS = {
  placed: "Order Placed",
  accepted: "Accepted",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

export const MENU_CATEGORIES = [
  "In evidenza",
  "Burger",
  "Wrap",
  "French Tacos",
  "Naan Combo",
  "Grigliate",
  "Chicken Combo",
  "Insalate",
  "Snaks",
  "Family Deal",
  "Dolci",
  "Bevande",
  "Patatine",
]

export const CUSTOMIZATION_OPTIONS: CustomOption[] = [
  { id: "extra-cheese", name: "Extra Cheese", priceEur: 1.5, category: "cheese" },
  { id: "spicy-sauce", name: "Spicy Sauce", priceEur: 0.5, category: "sauce" },
  { id: "double-patty", name: "Double Patty", priceEur: 3.0, category: "patty" },
  { id: "extra-mayo", name: "Extra Mayo", priceEur: 0.5, category: "sauce" },
  { id: "extra-ketchup", name: "Extra Ketchup", priceEur: 0.0, category: "sauce" },
  { id: "extra-mustard", name: "Extra Mustard", priceEur: 0.0, category: "sauce" },
  { id: "extra-pickles", name: "Extra Pickles", priceEur: 0.5, category: "veggie" },
  { id: "extra-onions", name: "Extra Onions", priceEur: 0.0, category: "veggie" },
  { id: "extra-lettuce", name: "Extra Lettuce", priceEur: 0.0, category: "veggie" },
  { id: "extra-tomato", name: "Extra Tomato", priceEur: 0.5, category: "veggie" },
  { id: "extra-jalapenos", name: "Extra Jalapeños", priceEur: 0.5, category: "veggie" },
  { id: "extra-bagels", name: "Extra Bagels", priceEur: 0.5, category: "extra" },
]

export const REMOVABLE_ITEMS = [
  { id: "lettuce", name: "Lettuce" },
  { id: "tomato", name: "Tomato" },
  { id: "onion", name: "Onion" },
  { id: "cheese", name: "Cheese" },
  { id: "mayo", name: "Mayo" },
  { id: "sauce", name: "Sauce" },
  { id: "pickles", name: "Pickles" },
]

export const FRIES_OPTIONS: FriesOption[] = [
  { size: "small", name: "Small Fries", extraPrice: 0 },
  { size: "medium", name: "Medium Fries", extraPrice: 0.5 },
  { size: "large", name: "Large Fries", extraPrice: 1.5 },
]

export const DRINK_ITEMS = [
  { id: "coke", name: "Coca-Cola", imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=200&auto=format&fit=crop" },
  { id: "coke-zero", name: "Coca-Cola Zero", imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=200&auto=format&fit=crop" },
  { id: "fanta", name: "Fanta", imageUrl: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?q=80&w=200&auto=format&fit=crop" },
  { id: "sprite", name: "Sprite", imageUrl: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=200&auto=format&fit=crop" },
  { id: "pepsi", name: "Pepsi", imageUrl: "https://images.unsplash.com/photo-1553456558-aff63285bdd1?q=80&w=200&auto=format&fit=crop" },
  { id: "water", name: "Water", imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=200&auto=format&fit=crop" },
  { id: "orange-juice", name: "Orange Juice", imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=200&auto=format&fit=crop" },
]

export const DEFAULT_INGREDIENTS = {
  burger: ["lettuce", "tomato", "onion", "cheese", "sauce", "pickles"],
  wrap: ["lettuce", "tomato", "onion", "sauce"],
  tacos: ["lettuce", "tomato", "cheese", "sauce"],
  naan: ["onion", "sauce", "cheese"],
}

export const MAX_REMOVAL_DISCOUNT = 2.0

export const EXTRA_FRIES_PRICE = 2.5
export const EXTRA_DRINKS_PRICE = 2.0
