# 🔗 City Computer E-Commerce Backend

The backend of the City Computer E-Commerce platform is built to ensure a robust, scalable, and secure online shopping experience. Utilizing modern technologies like TypeScript, Express.js, and PostgreSQL, it provides efficient data handling, seamless transactions, and organized code architecture following the MVC pattern.

[![Live API](https://img.shields.io/badge/API-Live-brightgreen?style=for-the-badge)](https://citycomputersbackend.vercel.app/)

[![Frontend Live](https://img.shields.io/badge/Frontend-Live-brightgreen?style=for-the-badge)](https://citycomputer.vercel.app/)

---

## **Technologies Used**

- **TypeScript:** Ensures type safety and improved code maintainability.
- **Express.js:** Minimal and flexible Node.js web framework.
- **PostgreSQL:** Reliable, scalable SQL database management.
- **Prisma:** Modern ORM for seamless database operations.
- **Cloudinary:** Image storage and media management.
- **Stripe & Aamarpay:** Secure payment gateway integrations.

---

## **Features**

### **User Management**

- **Authentication:** Secure JWT-based login and signup.
- **Role-Based Access Control:** Differentiates between admin, vendors, and customers.

### **Product Management**

- **CRUD Operations:** Add, edit, and delete products.
- **Inventory Tracking:** Monitors product stock levels.

### **Order Management**

- **Order Tracking:** Manage orders from creation to fulfillment.
- **Payment Integration:** Secure checkout using Stripe and Aamarpay.

### **Review & Rating System**

- **Customer Feedback:** Allows customers to post reviews and ratings.

### **Admin Dashboard**

- Manage vendors, products, and orders.
- View and control user activities.

### **Vendor Dashboard**

- Manage shop details, products, and sales records.

### **Cart & Checkout System**

- **Single-Vendor Cart:** Optimized for streamlined purchasing.
- **Coupons & Discounts:** Apply promotional codes.

### **Security & Scalability**

- **Data Protection:** Implements best security practices.
- **Scalability:** Designed to handle growing user and product bases.

---

## **Project Structure - MVC Pattern**

```
City Computer Backend
├── src
│   ├── app
│   │   ├── modules
│   │   │   ├── controllers
│   │   │   ├── models
│   │   │   ├── services
│   │   │   ├── routes
│   │   └── app.ts
├── .env.example
├── package.json
└── tsconfig.json
```

### **Controllers:** Handle requests and responses.

### **Models:** Define data schemas using Prisma.

### **Services:** Implement business logic.

### **Routes:** Connect endpoints with controllers.

---

## **Getting Started**

### **Prerequisites**

- Node.js
- Yarn
- PostgreSQL

### **Installation**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/naimuddin94/city_computer_backend.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd city_computer_backend
   ```

3. **Install dependencies:**

   ```bash
   yarn install
   ```

4. **Set environment variables:**
   Create a `.env` file in the root directory based on `.env.example`.

5. **Start the development server:**

   ```bash
   yarn dev
   ```

6. **Build the project:**
   ```bash
   yarn build
   ```

---

## **API Documentation**

Detailed API documentation is available through Postman. It includes endpoints, request formats, and response structures.

[![Postman Docs](https://img.shields.io/badge/Postman-API_Docs-orange?style=for-the-badge&logo=postman)](https://documenter.getpostman.com/view/34122341/2sAYHzFhRZ)

---

## **Database Diagram**

![Database Diagram](https://res.cloudinary.com/dxoncladp/image/upload/v1734270683/city_computer_final_db_diagram_qbgbcz.png)

---

## **Contributing**

Contributions are welcome! Fork the repository, make changes, and submit a pull request.

---

## **License**

This project is licensed under the MIT License. See the LICENSE file for details.

---

## **Acknowledgements**

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- [Cloudinary](https://cloudinary.com/)
- [Stripe](https://stripe.com/)

---

## **Contact**

For questions or suggestions, feel free to reach out:

[![Connect on LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](www.linkedin.com/in/iamnaimuddin)

---

This backend project showcases advanced web development skills, emphasizing clean architecture, security, and scalability in delivering a professional-grade eCommerce application.
