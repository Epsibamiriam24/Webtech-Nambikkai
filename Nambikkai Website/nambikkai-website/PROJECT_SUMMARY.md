# NAMBIKKAI WEBSITE - PROJECT SUMMARY

---

## **1. APPLICATION DESCRIPTION**

### **1.1 Project Overview**
The **Nambikkai Website** is a full-stack e-commerce application for selling natural products, millets, and organic goods. It provides a complete platform for customers to browse products, manage shopping carts, and place orders, while enabling administrators to manage products, inventory, and team members.

### **1.2 Purpose & Goals**
- **Customer-facing**: User authentication, product browsing, cart management, order checkout.
- **Admin-facing**: Dashboard with sales analytics, product management (CRUD), inventory control, and team management.
- **Security**: Role-based access control (users vs. admins), JWT-based authentication, password hashing.

### **1.3 Key Features**

#### **User Features**
1. **User Authentication**: Sign up, login, logout, persistent sessions.
2. **Product Catalog**: Browse all products with filters and search.
3. **Product Details**: View detailed product information, reviews, and ratings.
4. **Shopping Cart**: Add/remove products, update quantities, clear cart.
5. **Checkout & Orders**: Place orders, view order history, track status.
6. **User Profile**: View personal information and address.

#### **Admin Features**
1. **Admin Dashboard**: Real-time sales stats, order count, product count.
2. **Product Management**: Add, edit, delete products with image uploads.
3. **Order Management**: View all orders, update order status (pending, shipped, delivered).
4. **Team Management**: Add/remove admin members, assign granular permissions.
5. **Admin Hierarchy**: Different permission levels for different admins.

---

## **2. DATABASE INTEGRATION**

### **2.1 Database Technology**
- **Type**: NoSQL (Document-based)
- **Database**: MongoDB
- **ODM**: Mongoose (Object Data Modeling for Node.js)

### **2.2 Database Connection**
```javascript
// In backend/server.js
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
```
- Connection URI from `.env` file
- Handles connection pooling and error handling

### **2.3 Database Schema & Collections**

#### **a) User Collection**
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (hashed with bcrypt, required),
  phone: String (optional),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  role: Enum['user', 'admin'] (default: 'user'),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```
**Purpose**: Stores user credentials, profile info, and role-based access.

---

#### **b) Product Collection**
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  price: Number (required),
  stock: Number,
  image: String (file path),
  category: String,
  createdBy: ObjectId (reference to User/Admin),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```
**Purpose**: Stores product catalog with prices, descriptions, and inventory.

---

#### **c) Cart Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  items: [
    {
      productId: ObjectId (reference to Product),
      quantity: Number,
      price: Number (price at time of add)
    }
  ],
  totalPrice: Number (calculated),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```
**Purpose**: Stores user's shopping cart items and total.

---

#### **d) Order Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  items: [
    {
      productId: ObjectId,
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  totalPrice: Number,
  shippingAddress: {
    street: String,
    city: String,
    zipCode: String,
    country: String
  },
  paymentMethod: String,
  status: Enum['pending', 'shipped', 'delivered', 'cancelled'],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```
**Purpose**: Stores completed orders and order history.

---

#### **e) AdminMember Collection**
```javascript
{
  _id: ObjectId,
  adminId: ObjectId (reference to User with admin role),
  memberId: ObjectId (reference to another User),
  role: String (e.g., 'product-manager', 'order-manager'),
  permissions: {
    canAddProduct: Boolean,
    canEditProduct: Boolean,
    canDeleteProduct: Boolean,
    canViewOrders: Boolean,
    canUpdateOrderStatus: Boolean,
    canManageTeam: Boolean
  },
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```
**Purpose**: Manages admin hierarchy and granular permissions.

---

### **2.4 Database Relationships**

```
User (admin)
  ├── has many Products (1:N)
  ├── has many Orders (1:N)
  └── manages AdminMembers (1:N)

User (regular)
  ├── has one Cart (1:1)
  └── has many Orders (1:N)

Cart
  ├── belongs to User (N:1)
  └── contains many Products (N:M)

Order
  ├── belongs to User (N:1)
  └── contains Products (N:M with quantity)

AdminMember
  ├── references admin User (N:1)
  └── references member User (N:1)
```

### **2.5 Indexing & Optimization**
- **Unique index on email**: Prevents duplicate user registrations
- **Text indexes (optional future)**: For product search functionality

---

## **3. CONCEPTS APPLIED**

### **3.1 BACKEND CONCEPTS**

#### **A. Architecture & Design Patterns**

1. **MVC-like Pattern**
   - **Models** (`backend/models/`): Define data schemas (User, Product, etc.)
   - **Routes** (`backend/routes/`): API endpoints (logic layer)
   - **Middleware** (`backend/middleware/`): Cross-cutting concerns (auth, validation)

2. **RESTful API Design**
   ```
   POST   /api/auth/signup      → Create user account
   POST   /api/auth/login       → Authenticate and get token
   GET    /api/products         → List all products
   POST   /api/products         → Create product (admin only)
   PUT    /api/products/:id     → Update product
   DELETE /api/products/:id     → Delete product
   POST   /api/cart/add         → Add to cart
   POST   /api/orders/checkout  → Place order
   ```

3. **Separation of Concerns**
   - Routes handle HTTP logic
   - Models handle data validation
   - Middleware handle cross-cutting concerns

#### **B. Authentication & Authorization**

1. **JWT (JSON Web Token)**
   - Stateless authentication
   - Token contains: `{ userId, email, role }`
   - Expiry: 7 days
   - Signed with `process.env.JWT_SECRET`

   ```javascript
   const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
   ```

2. **Password Hashing with Bcrypt**
   - Salt rounds: 10
   - Never stores plaintext passwords
   - Comparison: `bcrypt.compare(inputPassword, hashedPassword)`

   ```javascript
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password, salt);
   ```

3. **Role-Based Access Control (RBAC)**
   - `role: 'user'` → Can browse products, manage cart, view own orders
   - `role: 'admin'` → Can access dashboard, manage products, manage team
   - Middleware checks role before allowing access:
   
   ```javascript
   // Protected route example
   if (user.role !== 'admin') {
     return res.status(403).json({ message: 'Access denied' });
   }
   ```

#### **C. Input Validation**

1. **Express-validator**
   ```javascript
   body('email').isEmail().withMessage('Valid email is required'),
   body('password').isLength({ min: 6 }).withMessage('Min 6 characters'),
   body('name').notEmpty().withMessage('Name is required')
   ```

2. **Server-side validation** ensures data integrity and security

#### **D. File Upload Handling**

1. **Multer Middleware**
   - Handles multipart/form-data
   - Stores product images in `backend/uploads/`
   - Configurable file size limits

#### **E. Error Handling**

1. **Centralized error middleware**
   ```javascript
   app.use((err, req, res, next) => {
     res.status(500).json({ message: 'Error', error: err.message });
   });
   ```

2. **Try-catch in routes**
   ```javascript
   try {
     // logic
   } catch (error) {
     res.status(500).json({ message: 'Server error', error: error.message });
   }
   ```

#### **F. Environment Configuration**
- `.env` file stores sensitive data: `MONGODB_URI`, `JWT_SECRET`, `PORT`
- `dotenv` package loads environment variables safely

---

### **3.2 FRONTEND CONCEPTS**

#### **A. Component Architecture**

1. **Functional Components with Hooks**
   ```javascript
   import React, { useState, useEffect } from 'react';
   
   const Login = ({ onLogin }) => {
     const [formData, setFormData] = useState({ email: '', password: '' });
     // component logic
   };
   ```

2. **Component Hierarchy**
   - App.js (root) → Navbar + Routes
   - Pages (full-page components)
   - Components (reusable UI pieces)

#### **B. State Management**

1. **React Hooks**
   - `useState`: Local component state (form data, loading, errors)
   - `useEffect`: Side effects (fetching data, checking auth on mount)
   - `useNavigate`: Programmatic navigation (React Router)

2. **Global State** (in App.js)
   ```javascript
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   // Passed to all components via props
   ```

#### **C. Authentication Flow**

1. **Local Storage Persistence**
   ```javascript
   localStorage.setItem('token', response.data.token);
   localStorage.setItem('user', JSON.stringify(response.data.user));
   ```

2. **Axios Interceptor** (automatic token attachment)
   ```javascript
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

3. **Route Protection** (conditional rendering)
   ```javascript
   if (user?.role === 'admin') {
     return <AdminDashboard />;
   } else {
     return <Navigate to="/" />;
   }
   ```

#### **D. Form Handling**

1. **Controlled Components**
   ```javascript
   <input
     type="email"
     name="email"
     value={formData.email}
     onChange={handleChange}
   />
   ```

2. **Async Form Submission**
   ```javascript
   const handleSubmit = async (e) => {
     e.preventDefault();
     setLoading(true);
     try {
       const response = await authAPI.login(formData);
       // success handling
     } catch (err) {
       setError(err.response?.data?.message);
     }
   };
   ```

#### **E. HTTP Client (Axios)**

1. **Centralized API Configuration**
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
   const api = axios.create({ baseURL: API_BASE_URL });
   ```

2. **API Methods Export**
   ```javascript
   export const authAPI = {
     signup: (data) => api.post('/auth/signup', data),
     login: (data) => api.post('/auth/login', data)
   };
   
   export const productAPI = {
     getAll: (params) => api.get('/products', { params }),
     getById: (id) => api.get(`/products/${id}`)
   };
   ```

#### **F. Routing (React Router v6)**

1. **Route Definition**
   ```javascript
   <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/login" element={<Login onLogin={handleLogin} />} />
     <Route path="/products" element={<Products />} />
     <Route path="/admin/*" element={
       user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />
     } />
   </Routes>
   ```

2. **Protected Routes**: Show different content based on user role

#### **G. Styling**

1. **CSS Modules** (component-specific CSS)
   - `Auth.css`, `Navbar.css`, `ProductCard.css` per component
   
2. **Global CSS** (`index.css`)
   - Base styles, variables, resets

---

### **3.3 SECURITY CONCEPTS**

#### **Backend Security**
1. **JWT Expiration**: Tokens expire in 7 days
2. **Bcrypt Hashing**: Passwords hashed with salt
3. **Input Validation**: Express-validator prevents malformed data
4. **CORS**: Configured to allow frontend requests
5. **HTTP Headers**: Protect against common attacks

#### **Frontend Security**
1. **HTTPS (recommended)**: Encrypt data in transit
2. **localStorage Risks**: Vulnerable to XSS; mitigation: HttpOnly cookies
3. **Token Refresh**: Consider implementing short-lived access tokens + refresh tokens
4. **CSRF Protection**: Add CSRF tokens if using cookies

---

### **3.4 PERFORMANCE CONCEPTS**

1. **Database Indexing**: Unique index on email prevents N+1 queries
2. **Lazy Loading (optional)**: Load pages on-demand with React Router
3. **Image Optimization**: Store product images efficiently
4. **Caching (optional)**: Cache product list on frontend

---

## **4. TECHNOLOGY STACK**

### **Backend**
| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | - |
| Framework | Express.js | 4.18.2 |
| Database | MongoDB | - |
| ODM | Mongoose | 7.0.0 |
| Authentication | JWT | 9.0.0 |
| Password Hashing | Bcrypt.js | 2.4.3 |
| File Upload | Multer | 1.4.5 |
| Validation | Express-validator | 7.0.0 |
| CORS | CORS middleware | 2.8.5 |
| Dev Tool | Nodemon | 2.0.20 |

### **Frontend**
| Component | Technology | Version |
|-----------|-----------|---------|
| UI Library | React | 18.2.0 |
| Routing | React Router | 6.11.0 |
| HTTP Client | Axios | 1.4.0 |
| Icons | React Icons | 4.8.0 |
| Styling | CSS + Tailwind (optional) | 3.3.0 |
| Build Tool | Create React App | 5.0.1 |

---

## **5. DATA FLOW DIAGRAMS**

### **5.1 User Login Flow**
```
┌─────────────────┐
│ User enters     │
│ email/password  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Signup.js       │
│ handleSubmit()  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ authAPI.login() │
│ POST /api/auth  │
│ /login          │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ Backend auth.js             │
│ - Validate input            │
│ - Find user by email        │
│ - Compare password (bcrypt) │
│ - Sign JWT token            │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────┐
│ Return { token,     │
│ user } (201)        │
└────────┬────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Frontend Auth.js             │
│ - Store token in localStorage│
│ - Store user in localStorage │
│ - Call onLogin(user)         │
│ - Navigate to /              │
└──────────────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Axios Request Interceptor    │
│ Attaches: Authorization      │
│ Bearer <token>               │
└──────────────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ All future API requests      │
│ include JWT token            │
│ Backend verifies token       │
└──────────────────────────────┘
```

### **5.2 Product Management Flow (Admin)**
```
Admin → AdminProducts.js → productAPI.create(data)
   → POST /api/products (with Multer file upload)
   → Backend: routes/products.js
   → Middleware: auth.js (verify admin role)
   → Middleware: upload.js (save image)
   → Models: Product.js (save to MongoDB)
   → Response: { id, name, price, image }
   → Frontend: Re-render AdminProducts component
```

---

## **6. KEY API ENDPOINTS**

### **Authentication**
- `POST /api/auth/signup` → Register new user
- `POST /api/auth/login` → Login and get JWT
- `POST /api/auth/login-or-signup` → One-step login/signup

### **Products**
- `GET /api/products` → List all products (with filters)
- `GET /api/products/:id` → Get single product
- `POST /api/products` → Create product (admin only, requires file upload)
- `PUT /api/products/:id` → Update product (admin only)
- `DELETE /api/products/:id` → Delete product (admin only)

### **Cart**
- `GET /api/cart` → Get user's cart
- `POST /api/cart/add` → Add item to cart
- `POST /api/cart/remove` → Remove item from cart
- `POST /api/cart/update-quantity` → Update item quantity
- `POST /api/cart/clear` → Clear entire cart

### **Orders**
- `POST /api/orders/checkout` → Create order from cart
- `GET /api/orders` → Get user's orders
- `GET /api/orders/:id` → Get order details

### **Admin**
- `GET /api/admin/dashboard/stats` → Sales statistics
- `POST /api/admin/members/add` → Add admin member
- `GET /api/admin/members` → List admin team
- `PUT /api/admin/members/:id` → Update member permissions
- `DELETE /api/admin/members/:id` → Remove admin member
- `GET /api/admin/orders/all` → View all orders
- `PUT /api/admin/orders/:id/status` → Update order status

---

## **7. PROJECT STRENGTHS & BEST PRACTICES**

✅ **Authentication**: Secure JWT + bcrypt implementation  
✅ **Database**: Proper MongoDB schema design with relationships  
✅ **API Design**: RESTful endpoints with proper HTTP methods  
✅ **Input Validation**: Server-side validation with express-validator  
✅ **Error Handling**: Centralized error middleware  
✅ **Role-Based Access**: Admin vs. user permissions  
✅ **File Upload**: Multer configured for product images  
✅ **Separation of Concerns**: Models, routes, middleware properly organized  
✅ **Environment Config**: Sensitive data in .env file  
✅ **Frontend State Management**: Proper use of React hooks  
✅ **HTTP Interceptor**: Automatic token attachment to requests  

---

## **8. RECOMMENDED IMPROVEMENTS**

1. **Token Refresh**: Implement refresh tokens for better security
2. **Auto-logout**: Add 401 response interceptor to auto-logout on token expiry
3. **Validation Details**: Show field-level validation errors from backend
4. **Error Logging**: Implement centralized error logging (Sentry, LogRocket)
5. **Unit Tests**: Add Jest + React Testing Library tests
6. **Rate Limiting**: Add rate limiting on auth endpoints
7. **HTTPS**: Deploy with SSL/TLS certificates
8. **Database Backup**: Implement automated MongoDB backup strategy
9. **API Documentation**: Add Swagger/OpenAPI documentation
10. **Caching**: Implement Redis caching for product catalog

---

## **9. DEPLOYMENT CONSIDERATIONS**

### **Backend Deployment**
- Host on Heroku, AWS EC2, or DigitalOcean
- Set production environment variables (JWT_SECRET, MONGODB_URI)
- Enable HTTPS with SSL certificate
- Set CORS origin to production frontend URL

### **Frontend Deployment**
- Build optimized bundle: `npm run build`
- Deploy on Vercel, Netlify, or AWS S3 + CloudFront
- Set REACT_APP_API_URL to production backend URL
- Enable gzip compression

### **Database**
- Use MongoDB Atlas (cloud) or self-hosted MongoDB
- Enable authentication and encryption
- Configure backup policies
- Set up connection pooling

---

## **10. VIVA PREPARATION SUMMARY**

**Key Points to Remember:**
1. Full-stack e-commerce platform with React + Express + MongoDB
2. JWT + Bcrypt for secure authentication
3. Role-based access control (user vs. admin)
4. RESTful API design with proper separation of concerns
5. Axios interceptor for automatic token attachment
6. localStorage for client-side token persistence
7. MongoDB schemas with proper relationships
8. Express middleware for validation and file upload
9. Protected routes based on user role
10. Responsive UI with form validation and error handling

---

**Project Status**: Production-ready with recommended security enhancements

