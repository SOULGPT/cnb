# Curry & Burger - Product Requirements Document (PRD)

## Executive Summary

Curry & Burger is a modern, full-featured restaurant ordering application that combines the best of Indian/Pakistani cuisine with premium burger offerings. The app provides a seamless experience for customers to browse menus, customize meals, place orders, and track deliveries, while offering restaurant administrators comprehensive tools to manage inventory, deals, staff, and operations.

**Version:** 1.0.0  
**Last Updated:** April 2026  
**Platform:** Mobile-First Web Application (iOS, Android, Desktop)

---

## 1. Product Overview

### 1.1 Vision
To revolutionize the food ordering experience by providing customers with an intuitive, fast, and personalized way to order authentic curry and premium burgers, while empowering restaurants with powerful management tools.

### 1.2 Core Values
- **Speed**: Fast ordering and delivery
- **Customization**: Full control over meal personalization
- **Transparency**: Real-time order tracking and pricing clarity
- **Quality**: Premium ingredients and consistent preparation
- **Convenience**: Multiple ordering methods (pickup, delivery, dine-in)

### 1.3 Target Users
- **Primary**: Urban professionals aged 18-45 looking for quick, customizable meals
- **Secondary**: Families seeking convenient dining options
- **Tertiary**: Businesses for catering orders

---

## 2. Core Features

### 2.1 Customer-Facing Features

#### 2.1.1 Authentication & User Management
- **Email/Password Registration & Login**
- **User Profile Management**
  - Personal information (name, email, phone)
  - Multiple saved addresses with labels
  - Default delivery address
  - Order history
  - Favorite items/meals

#### 2.1.2 Menu Browsing
- **Dynamic Menu Display**
  - Categories: Burgers, Wraps, Curry, Fries, Drinks, Desserts, etc.
  - Real-time filtering by category
  - Search functionality
  - Item availability status
  - Nutritional information (optional)
  - Item ratings (future feature)

- **Menu Item Details**
  - High-quality product images (carousel)
  - Detailed description
  - Price display
  - Ingredient list
  - Customer reviews (future)
  - Similar items suggestions

#### 2.1.3 Meal Customization
- **Burger Personalization**
  - Choose protein options (beef, chicken, veggie, double patty)
  - Select cheese varieties (cheddar, swiss, mozzarella, none)
  - Pick vegetables (lettuce, tomato, onions, pickles)
  - Choose sauces (mayo, ketchup, mustard, special sauce)
  - Add extras (bacon, fried egg, grilled onions)
  - Select spice level (no-spicy, mild, regular, extra)
  - Remove ingredients for free
  - Add special instructions/notes

- **Curry Customization**
  - Spice level selection
  - Side options (rice, naan, roti)
  - Extra accompaniments
  - Portion size selection

- **Quantity Control**
  - Increment/decrement item quantity
  - Real-time price calculation

#### 2.1.4 Deals & Promotions
- **Combo Deals**
  - Pre-configured meal bundles
  - Main item + sides + drinks
  - Customizable selections within each section
  - Significant savings vs individual items
  - Visual indicators showing savings percentage

- **Time-Limited Promotions**
  - Flash sales
  - Happy hour specials
  - Weekend offers
  - First-time user discounts

- **Promotional Banner**
  - Rotating carousel on homepage
  - Priority-based display
  - Time-sensitive indicators

#### 2.1.5 Shopping Cart
- **Cart Management**
  - View all items with customizations
  - Edit item quantities
  - Remove items
  - Save items for later
  - Apply coupon codes
  - Clear entire cart
  - Persistent cart (saved across sessions)

- **Price Breakdown**
  - Subtotal
  - Tax calculation
  - Discount amount
  - Delivery fee
  - Total price
  - Real-time updates

#### 2.1.6 Discounts & Coupons
- **Coupon System**
  - Percentage-based discounts
  - Fixed amount discounts
  - Minimum order requirements
  - Maximum discount caps
  - Expiry dates
  - Usage limits (total and per customer)

- **Usage Control**
  - Single-use per customer (admin-configurable)
  - Unlimited-use per customer (admin-configurable)
  - Track usage history
  - Prevent duplicate usage for single-use coupons

- **Coupon Application**
  - Enter coupon code before checkout
  - Instant discount calculation
  - Validation messages
  - Error handling for invalid/expired codes

#### 2.1.7 Checkout & Ordering
- **Order Type Selection**
  - Pickup: Collect from restaurant at specified time
  - Delivery: Address-based delivery
  - Dine-in: Table service at restaurant

- **Address Management** (for delivery orders)
  - Select from saved addresses
  - Add new delivery address
  - Google Maps integration for address verification
  - Delivery time estimation

- **Payment Methods**
  - **Cash on Delivery** (for delivery orders) - ACTIVE
  - **Pay at Restaurant** (for pickup orders) - ACTIVE
  - **Online Payment** (Credit/Debit Card) - COMING SOON
    - Stripe integration (prepared, not yet enabled)

- **Order Review**
  - Final item verification
  - Price confirmation
  - Delivery/pickup details
  - Special instructions field
  - Terms & conditions acceptance

- **Order Confirmation**
  - Instant order number generation
  - Confirmation email/SMS (future)
  - Estimated delivery/pickup time
  - Order receipt PDF download
  - QR code for order tracking

#### 2.1.8 Order Tracking
- **Real-Time Status Updates**
  - Order placed
  - Accepted by restaurant
  - Being prepared
  - Ready for pickup/out for delivery
  - Delivered/ready for collection
  - Cancelled

- **Live Tracking** (for delivery orders)
  - Courier location on map
  - Estimated arrival time
  - Contact courier directly (future)

- **Order History**
  - All past orders with details
  - Reorder functionality
  - Order search/filtering
  - Rating & review submission (future)

#### 2.1.9 Loyalty Program
- **Points System**
  - Earn points on every purchase
  - Earn rate: 1 point per €1 spent
  - Points display in profile

- **Loyalty Tiers** (Future Enhancement)
  - Classic: 0-500 points
  - Gold: 501-1000 points
  - Platinum: 1001+ points
  - Tier-specific benefits and discounts

- **Points Redemption**
  - Redeem points for discounts
  - Minimum redemption threshold
  - Automatic application at checkout

- **Loyalty Dashboard**
  - Current points balance
  - Tier status
  - Available rewards
  - Points history

#### 2.1.10 Favorites & Wishlist
- **Save Favorite Items**
  - Quick add to cart from favorites
  - Remove from favorites
  - Favorite items section in menu

#### 2.1.11 Mobile Navigation
- **Bottom Navigation Bar (Mobile Only)** - FIXED
  - Home icon → Homepage
  - Menu icon → Full menu browse
  - Deals icon → Promotions & combo deals
  - Track icon → Order tracking & history
  - Cart icon → Shopping cart with badge showing item count
  - Remains fixed while scrolling for easy navigation

- **Responsive Design**
  - Mobile-first approach
  - Tablet-optimized layout
  - Desktop experience
  - Touch-friendly buttons and controls

---

### 2.2 Admin Dashboard Features

#### 2.2.1 Authentication
- **Admin Login**
  - Secure authentication
  - Role-based access control
  - Session management
  - Activity logging

#### 2.2.2 Menu Management
- **Menu Items CRUD**
  - Create new menu items
  - Edit item details (name, description, price, image)
  - Enable/disable availability
  - Publish/unpublish items
  - Bulk operations

- **Category Management**
  - Create/edit/delete categories
  - Reorder categories
  - Set category images
  - Hide/show categories

- **Image Management**
  - Upload product images
  - Crop and resize
  - Lazy loading optimization
  - Image hosting (Vercel Blob)

- **Inventory Tracking**
  - Mark items as out of stock
  - Set stock levels
  - Automatic alerts for low stock

#### 2.2.3 Deal & Promotion Management
- **Create Deals**
  - Configure combo bundles
  - Set main items (required/optional)
  - Add side options (fries, rice, naan)
  - Add drink options
  - Set deal pricing with savings display
  - Set validity period
  - Enable/disable deals
  - Upload deal images
  - Set priority for carousel display

- **Edit Existing Deals**
  - Modify item configurations
  - Update pricing
  - Change validity
  - Remove old deals

- **Deal Analytics** (Future)
  - Track deal popularity
  - Revenue by deal
  - Customer feedback

- **Promotion Management**
  - Create time-limited promotions
  - Set discount percentages
  - Manage promotional banners
  - Schedule future promotions

#### 2.2.4 Coupon & Discount Management
- **Coupon Creation**
  - Enter coupon code
  - Set discount type (percentage or fixed amount)
  - Set discount value
  - Set validity dates
  - Set usage limits (total usage)
  - **NEW: Choose usage per customer**
    - Single-use: Customer can use coupon only once
    - Unlimited: Customer can use coupon multiple times
  - Set minimum order amount requirement
  - Set maximum discount cap
  - Activate/deactivate coupons
  - View usage statistics

- **Coupon Management**
  - Edit existing coupons
  - Delete coupons
  - View coupon performance metrics
  - Export coupon reports
  - **Track who used the coupon** (usedBy list)
  - Prevent duplicate usage for single-use coupons

#### 2.2.5 Order Management
- **Order Dashboard**
  - Real-time order list with status updates
  - Filter by status, date, payment method
  - Search orders by order ID/customer name
  - Sort by date, total amount, status

- **Order Details**
  - Customer information
  - Items ordered with customizations
  - Special instructions/notes
  - Delivery/pickup address
  - Payment status and method
  - Applied coupon and discount
  - Order total breakdown

- **Status Management**
  - Update order status manually
  - Change from "placed" → "accepted" → "preparing" → "ready" → "out for delivery" → "delivered"
  - Cancel orders with reason
  - Generate picking lists for kitchen
  - Generate packing slips

- **Order Actions**
  - Accept/reject orders
  - Mark as ready
  - Mark as delivered
  - Print order receipt
  - Send customer notifications
  - Refund orders

#### 2.2.6 Ingredient Management
- **Ingredient Database**
  - Add new ingredients
  - Set ingredient categories (Sauce, Cheese, Veggie, Patty, Bread, Drink, Side, Other)
  - Set price adjustments
  - Mark as default/optional
  - Set ingredient availability
  - Upload ingredient images

#### 2.2.7 Analytics & Reports
- **Sales Dashboard**
  - Total revenue (daily, weekly, monthly)
  - Order count by status
  - Average order value
  - Popular items ranking
  - Revenue by category
  - Peak ordering times

- **Customer Analytics**
  - Total customers
  - Repeat customers
  - Customer acquisition rate
  - Customer lifetime value
  - Loyalty program statistics

- **Operational Metrics**
  - Average preparation time
  - Order acceptance rate
  - Customer satisfaction (rating average)
  - Delivery performance

- **Reports Export**
  - Generate PDF reports
  - Export to CSV
  - Customizable date ranges
  - Email reports

#### 2.2.8 Staff Management** (Future)
- **User Roles**
  - Admin: Full access
  - Manager: Order management, menu updates
  - Kitchen staff: Order visibility, status updates
  - Delivery staff: Delivery order management

- **Staff Activity**
  - Track actions (orders accepted, marked ready)
  - Shift management
  - Performance metrics

#### 2.2.9 Branch/Location Management** (Future)
- **Multi-Branch Support**
  - Add/edit branch locations
  - Set branch hours of operation
  - Branch-specific inventory
  - Branch-specific staff
  - Branch-specific promotions

---

## 3. Technical Architecture

### 3.1 Tech Stack
- **Frontend Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui with Radix UI
- **State Management**: Zustand + Context API
- **Backend**: Next.js API Routes + Firebase
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **File Storage**: Vercel Blob Storage
- **Payment Processing**: Stripe (prepared, not yet enabled)
- **Maps**: Google Maps API (future integration)
- **Animations**: Framer Motion

### 3.2 Data Models

#### 3.2.1 Collections Structure
```
users/
├── {userId}
│   ├── name: string
│   ├── email: string
│   ├── phone: string
│   ├── role: "customer" | "admin" | "staff"
│   ├── loyaltyPoints: number
│   ├── addresses: Address[]
│   ├── favorites: string[]
│   └── createdAt: timestamp

menu_items/
├── {itemId}
│   ├── categoryId: string
│   ├── name: string
│   ├── description: string
│   ├── priceEur: number
│   ├── imageUrl: string
│   ├── available: boolean
│   ├── published: boolean
│   ├── orderCount: number
│   ├── customizable: boolean
│   ├── ingredients: string[]
│   ├── allowedRemovals: string[]
│   ├── customOptions: CustomOption[]
│   └── createdAt: timestamp

menu_categories/
├── {categoryId}
│   ├── name: string
│   ├── description: string
│   ├── order: number
│   ├── imageUrl: string
│   └── active: boolean

deals/
├── {dealId}
│   ├── title: string
│   ├── description: string
│   ├── imageUrl: string
│   ├── priceEur: number
│   ├── originalPriceEur: number
│   ├── discount: string
│   ├── validFrom: timestamp
│   ├── validUntil: timestamp
│   ├── active: boolean
│   ├── items: DealItem[]
│   ├── category: string
│   ├── priority: number
│   └── createdAt: timestamp

coupons/
├── {couponId}
│   ├── code: string
│   ├── discountType: "percentage" | "fixed"
│   ├── discountValue: number
│   ├── validFrom: timestamp
│   ├── validTo: timestamp
│   ├── active: boolean
│   ├── minOrderAmount: number
│   ├── maxDiscount: number
│   ├── usageLimit: number
│   ├── usageCount: number
│   ├── usagePerCustomer: "single" | "unlimited"
│   ├── usedBy: string[]
│   └── createdAt: timestamp

orders/
├── {orderId}
│   ├── userId: string
│   ├── items: CartItem[]
│   ├── totalEur: number
│   ├── status: OrderStatus
│   ├── type: "pickup" | "delivery" | "dinein"
│   ├── address: Address
│   ├── tableNumber: string
│   ├── paymentStatus: "pending" | "paid" | "failed" | "refunded"
│   ├── paymentMethod: string
│   ├── couponCode: string
│   ├── discount: number
│   ├── loyaltyPointsUsed: number
│   ├── loyaltyPointsEarned: number
│   ├── note: string
│   ├── estimatedTime: timestamp
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp

ingredients/
├── {ingredientId}
│   ├── name: string
│   ├── priceAdjustment: number
│   ├── category: IngredientCategory
│   ├── default: boolean
│   ├── optional: boolean
│   ├── active: boolean
│   └── createdAt: timestamp
```

### 3.3 Real-Time Features
- **Menu Updates**: Firebase Firestore listeners provide real-time menu changes
- **Order Status**: Real-time order status updates from admin to customers
- **Availability**: Real-time item availability status

### 3.4 API Routes
- `/api/menu/items` - Fetch menu items (filtered by category)
- `/api/menu/categories` - Fetch all categories
- `/api/deals` - Fetch active deals
- `/api/coupons/validate` - Validate coupon code
- `/api/orders` - Create new order
- `/api/orders/[id]` - Fetch order details
- `/api/orders/[id]/status` - Update order status
- `/api/users/profile` - User profile management
- `/api/auth/register` - User registration
- `/api/auth/login` - User login

---

## 4. UI/UX Design System

### 4.1 Design Principles
- **Mobile-First**: Design for mobile, then scale to desktop
- **Clean & Minimal**: Reduce visual clutter, focus on content
- **Fast & Responsive**: Instant feedback for user actions
- **Accessible**: WCAG AA compliance
- **Consistent**: Unified design language throughout

### 4.2 Color Palette
- **Primary Brand Color**: #E78A00 (Warm Orange)
  - Used for buttons, active states, CTAs
  - Represents warmth and appetite
- **Secondary Color**: #C67500 (Darker Orange)
  - Used for hover states and emphasis
- **Neutrals**:
  - White (#FFFFFF) - backgrounds, cards
  - Light Gray (#F5F5F5) - secondary backgrounds
  - Dark Gray (#333333) - primary text
  - Medium Gray (#666666) - secondary text
- **Semantic Colors**:
  - Success/Green (#22C55E) - confirmed orders, available items
  - Warning/Yellow (#FBBF24) - pending status
  - Error/Red (#EF4444) - errors, unavailable items

### 4.3 Typography
- **Font Family**: Geist (sans-serif)
- **Headings**: Bold weight (700)
  - h1: 32px (mobile), 48px (desktop)
  - h2: 24px (mobile), 36px (desktop)
  - h3: 20px
  - h4: 16px
- **Body Text**: Regular weight (400)
  - Large: 16px
  - Regular: 14px
  - Small: 12px
- **Line Height**: 1.5 for body text, 1.2 for headings

### 4.4 Spacing System
- Base unit: 4px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px
- Margins & Padding: Follow 8px grid system
- Gap between elements: 16px

### 4.5 Component Library
- **Buttons**
  - Primary (Orange bg, white text)
  - Secondary (White bg, gray text)
  - Danger (Red bg)
  - Sizes: Small (32px height), Medium (40px), Large (48px)

- **Cards**
  - Rounded corners (8-12px radius)
  - Light shadow for depth
  - Padding: 16px-20px

- **Forms**
  - Input fields with labels
  - Error states with red text
  - Focus states with orange border
  - Helper text below inputs

- **Modals/Dialogs**
  - Bottom sheet on mobile (custom order builder, personalization)
  - Center modal on desktop
  - Smooth animations (fade in/slide up)

- **Navigation**
  - Top navigation: White background, logo left, menu right
  - Bottom navigation: Fixed, 5 icons, active state highlighted in orange

### 4.6 Pages & Layout

#### 4.6.1 Home Page (`/`)
- Header: Logo, search, user profile icon
- Hero Section: Feature banner (rotating promotions)
- Featured Deals: Carousel of current deals
- Menu Categories: Horizontal scroll or grid
- Popular Items: Grid of best sellers
- CTA: "Browse Full Menu"
- Footer: Information links (future)

#### 4.6.2 Menu Page (`/menu`)
- Header: Page title, search bar
- Category Tabs: Sticky horizontal scroll of categories
- Menu Grid: 
  - Mobile: Single column cards
  - Tablet: 2-column layout
  - Desktop: 3-4 column layout
- Each Card:
  - Product image (aspect ratio 1:1)
  - Product name
  - Short description (1-2 lines)
  - Price
  - "Personalizza" (customize) button
  - Add to cart button

#### 4.6.3 Item Details / Customization (`/menu/[id]`)
- Product image carousel
- Item name & description
- Full ingredients list
- Customization options (bottom sheet):
  - Protein selection
  - Cheese selection
  - Vegetables selection
  - Sauce selection
  - Extras/Toppings
  - Spice level slider
  - Special instructions textarea
  - Quantity selector
  - Price display (updates in real-time)
  - Add to cart button (prominent, sticky bottom)

#### 4.6.4 Deals Page (`/deals`)
- Featured deal carousel (large images)
- All deals grid:
  - Deal image
  - Title
  - Savings badge (e.g., "-30%")
  - Items included (visual items)
  - Price
  - Build Deal button (opens builder)
- Deal Builder (bottom sheet):
  - Modify deal items
  - Select options from each category
  - View price recalculation
  - Add to cart

#### 4.6.5 Cart Page (`/cart`)
- Cart Items List:
  - Item image, name, customizations
  - Quantity controls (-, quantity, +)
  - Item price
  - Remove button
- Order Summary:
  - Subtotal
  - Discount (if coupon applied)
  - Tax
  - Delivery fee (if applicable)
  - Total price (highlighted in orange)
- Coupon Section:
  - Enter coupon code input
  - Apply button
  - Discount amount display
- Actions:
  - "Continue Shopping" button
  - "Proceed to Checkout" button (primary, orange)

#### 4.6.6 Checkout Page (`/checkout`)
- Progress Indicator: Step 1/4 → Step 2/4 → Step 3/4 → Step 4/4
- Step 1: Order Type
  - Pickup / Delivery / Dine-in radio buttons
- Step 2: Delivery Details (if delivery)
  - Select address or add new
  - Address form with validation
  - Delivery time selection
- Step 3: Payment Method
  - Cash on Delivery / Pay at Restaurant / Online Payment (Coming Soon)
  - Payment method cards
- Step 4: Review & Place Order
  - Order review (all items, customizations, totals)
  - Special instructions textarea
  - "Place Order" button (primary)
  - Confirmation page with order number

#### 4.6.7 Order Tracking (`/track`)
- Current Active Orders List:
  - Order ID
  - Status badge (color-coded)
  - Items summary
  - Estimated time
  - "View Details" link
- Order History:
  - All past orders (paginated or infinite scroll)
  - Order ID, date, total, status
  - Reorder button
  - View details link
- Order Details Modal:
  - Full item list with customizations
  - Timeline of status changes
  - Live map (if delivery)
  - Contact driver (future)
  - Support/help option

#### 4.6.8 User Profile (`/profile`)
- Profile Header:
  - Avatar (initials or uploaded image)
  - Name, email, phone
  - Edit profile button
- Sections:
  - Addresses: Manage delivery addresses
  - Favorite Items: Quick reorder
  - Loyalty Points: Display points balance, tier, benefits
  - Order History: Quick access
  - Settings: Notifications, payment methods
  - Logout: Sign out button

#### 4.6.9 Admin Dashboard (`/admin`)
- Sidebar Navigation:
  - Dashboard (overview)
  - Menu Management
  - Deals Management
  - Orders
  - Coupons & Promotions
  - Analytics
  - Settings
  
- Dashboard Overview:
  - KPI cards: Today's revenue, order count, active orders, repeat customers
  - Sales chart (line graph, daily/weekly/monthly)
  - Top 5 items (bar chart)
  - Recent orders table
  
- Menu Management:
  - Category list with edit/delete
  - Menu items table with columns: name, category, price, availability, actions
  - Bulk edit option
  - Add item button (form modal)
  
- Order Management:
  - Real-time order list
  - Filter by status
  - Search by order ID
  - Status update buttons (quick actions)
  - Detailed order view with print receipt
  
- Coupon Management:
  - Coupon list table with columns: code, discount, usage, usage per customer, usedBy count, actions
  - Add coupon button (form)
  - Edit/delete coupon
  - View usage statistics per coupon

### 4.7 Responsive Breakpoints
- Mobile: 0px - 639px
- Tablet: 640px - 1023px
- Desktop: 1024px+

---

## 5. Features Status & Roadmap

### 5.1 Currently Active (MVP)
- ✅ User authentication (email/password)
- ✅ Menu browsing by category
- ✅ Item customization (burger builder)
- ✅ Shopping cart
- ✅ Checkout (delivery, pickup, dine-in)
- ✅ Cash on Delivery / Pay at Restaurant
- ✅ Order placement & confirmation
- ✅ Order tracking
- ✅ Admin menu management
- ✅ Admin order management
- ✅ Coupon system with usage control (single/unlimited per customer)
- ✅ Real-time menu sync (Firebase listeners)
- ✅ Deal builder with customization
- ✅ Fixed bottom navigation (mobile)
- ✅ Loyalty points earning

### 5.2 Coming Soon (Phase 2)
- 🔄 Online payment (Stripe integration) - Currently disabled, coming soon
- 🔄 Order ratings & reviews
- 🔄 Staff management & roles
- 🔄 Multi-branch support
- 🔄 SMS/Email notifications
- 🔄 Chat support
- 🔄 Advanced analytics

### 5.3 Future Enhancements (Phase 3)
- 🎯 Loyalty tier system (Classic, Gold, Platinum)
- 🎯 Google Maps integration
- 🎯 Contact courier during delivery
- 🎯 Scheduled orders (future delivery)
- 🎯 Subscription plans
- 🎯 Dietary preferences (vegan, gluten-free, allergies)
- 🎯 Nutritional information
- 🎯 Mobile app (iOS/Android native)
- 🎯 Catering platform

---

## 6. Key Business Rules

### 6.1 Pricing
- Base item price: Set by admin
- Customization extras: Add to base price
- Deals: Bundled pricing with savings
- Coupon discounts: Percentage or fixed amount
- Tax: Automatically calculated (configurable rate)
- Delivery fee: Configurable by admin (future: distance-based)

### 6.2 Delivery
- Default delivery time: 30-45 minutes
- Minimum order for delivery: €10
- Delivery areas: TBD by admin configuration
- Free delivery: TBD by promotion

### 6.3 Pickup
- Pickup time: Selectable by customer
- Minimum preparation time: 15 minutes
- Pickup location: Restaurant address

### 6.4 Dine-In
- Table selection required
- Waiter will serve customized orders
- Payment at end of meal (cash or card)

### 6.5 Order Cancellation
- Customer can cancel within 5 minutes of placement
- After 5 minutes: Admin discretion
- Refund policy: Full refund for cancelled orders

### 6.6 Coupon Rules
- Single-use coupons: Each customer can use once
- Unlimited-use coupons: Customer can use multiple times
- Expired coupons: Cannot be applied
- One coupon per order
- Coupon stacks with loyalty points (future)

### 6.7 Loyalty Points
- Earn rate: 1 point per €1 spent
- Points earned: Added after order confirmation
- Points redeemable: At checkout
- Minimum redemption: 50 points = €5

---

## 7. Non-Functional Requirements

### 7.1 Performance
- Page load time: < 2 seconds
- API response time: < 500ms
- Image lazy loading: Implemented
- Optimized bundle size: < 200KB gzipped

### 7.2 Reliability
- Uptime: 99.9%
- Error tracking: Sentry integration (future)
- Automated backups: Firebase handled
- Redundancy: Firebase replication

### 7.3 Security
- HTTPS: All traffic encrypted
- Authentication: Firebase Auth (OAuth 2.0)
- Authorization: Role-based access control
- Data encryption: Firebase database encryption
- PCI DSS: Compliance ready (Stripe prepared)
- GDPR: User data deletion options
- Rate limiting: API endpoints (future)

### 7.4 Scalability
- Database: Firebase auto-scaling
- CDN: Vercel edge caching
- Image hosting: Vercel Blob (unlimited storage)
- Functions: Serverless (auto-scaling)

### 7.5 Accessibility
- WCAG 2.1 Level AA compliance
- Screen reader support
- Keyboard navigation
- Color contrast: 4.5:1 minimum
- Touch target size: 48x48px minimum

---

## 8. Success Metrics

### 8.1 Business Metrics
- Monthly active users (MAU)
- Daily active users (DAU)
- Order volume (monthly)
- Average order value
- Customer lifetime value
- Repeat order rate
- Customer acquisition cost

### 8.2 Operational Metrics
- Average order preparation time
- Order accuracy rate
- Delivery on-time rate
- Customer complaints
- Food waste percentage

### 8.3 User Engagement Metrics
- Cart abandonment rate
- Conversion rate (browser to order)
- Average session duration
- Pages per session
- Return rate

### 8.4 Technical Metrics
- Page load time
- API response time
- Error rate
- Uptime percentage
- Database query performance

---

## 9. Compliance & Legal

### 9.1 Data Privacy
- GDPR Compliance (EU)
- CCPA Compliance (California)
- Privacy policy (in footer - future)
- Terms of service (in footer - future)
- User data deletion requests support (future)

### 9.2 Payment Compliance
- PCI DSS compliance (handled by Stripe)
- Secure token storage (Stripe)
- Fraud detection (Stripe)

### 9.3 Food Safety
- Allergen information (future)
- Nutritional labels (future)
- Food handling standards (admin responsibility)

---

## 10. Deployment & Environment

### 10.1 Environments
- **Development**: http://localhost:3000
- **Staging**: Vercel preview deployments
- **Production**: curry-and-burger.vercel.app

### 10.2 Infrastructure
- Hosting: Vercel
- Database: Firebase Firestore
- Storage: Vercel Blob
- CDN: Vercel Edge Network
- Monitoring: Vercel Analytics + Sentry (future)

### 10.3 CI/CD Pipeline
- Git: GitHub repository
- Deployment: Automatic on push to main
- Preview: Automatic preview deployments
- Rollback: Previous version rollback available

---

## 11. Release Notes & Versions

### Version 1.0.0 (Current)
- ✅ Complete user authentication
- ✅ Full menu browsing and customization
- ✅ Shopping cart and checkout
- ✅ Order placement (pickup, delivery, dine-in)
- ✅ Order tracking
- ✅ Admin menu management
- ✅ Admin order management
- ✅ Coupon system with usage control
- ✅ Loyalty points
- ✅ Fixed mobile navigation
- ✅ Real-time Firebase sync

### Upcoming: Version 1.1.0
- Online payment integration (Stripe)
- Order ratings and reviews
- SMS notifications
- Enhanced analytics

---

## 12. Appendix

### 12.1 Glossary
- **MVP**: Minimum Viable Product
- **CTA**: Call-to-Action
- **CRUD**: Create, Read, Update, Delete
- **API**: Application Programming Interface
- **UI/UX**: User Interface / User Experience
- **PCI DSS**: Payment Card Industry Data Security Standard
- **WCAG**: Web Content Accessibility Guidelines
- **GDPR**: General Data Protection Regulation
- **CCPA**: California Consumer Privacy Act

### 12.2 Contact & Support
- Product Manager: [Contact Info]
- Technical Lead: [Contact Info]
- Support Email: support@curry-and-burger.app
- Bug Reports: GitHub Issues

### 12.3 Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Apr 2026 | Product Team | Initial PRD |

---

**Document Status**: APPROVED FOR DEVELOPMENT  
**Last Updated**: April 2026  
**Next Review Date**: July 2026
