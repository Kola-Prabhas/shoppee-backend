# Swiftstore Backend

Welcome to [`Swiftstore`](https://swiftstore-rose.vercel.app), an e-commerce platform built to deliver a seamless shopping experience! This application supports essential e-commerce features like:

- **Browsing Items**: Browse different items on the platform.
- **Sorting & Filtering Items**: Easily find products that match your preferences.
- **Adding Items to Cart**: Keep track of desired products and manage your cart effortlessly.
- **Secure Payments**: Checkout using Stripe for a smooth and secure transaction experience.
- **User Authentication**: Login and signup functionalities to personalize the shopping experience.
- **Manage Addresses**: Users can securely add, update, and manage their delivery addresses.
- **Password Reset**: Reset password securely via a link sent to the user's registered email.
- **Order Notifications**: Receive an email confirmation when an order is successfully placed.

---

## Tools and Technologies
The backend of the Shopeee e-commerce platform is powered by a robust set of tools and libraries that ensure security, and smooth operation. Below is a detailed breakdown of the dependencies used:

## Dependencies

### Core Dependencies
- **Express**: A minimal and flexible Node.js web application framework for building APIs and web applications.
- **Mongoose**: A powerful ODM library for MongoDB, enabling schema-based modeling and easy data interaction.

### Security and Authentication
- **jsonwebtoken**: For implementing secure authentication using JSON Web Tokens (JWT).
- **passport**: Middleware for handling user authentication.
  - **passport-local**: Strategy for local authentication (e.g., username and password).
  - **passport-jwt**: Strategy for JWT-based authentication.
- **express-session**: For managing user sessions securely.
- **cookie-parser**: Middleware to parse cookies, enabling secure session handling.

### Utilities
- **dotenv**: For managing environment variables securely.
- **cors**: To enable cross-origin resource sharing, making APIs accessible to frontend applications.
- **crypto**: Provides cryptographic functionality for secure data handling.

### Email and Payment
- **nodemailer**: For sending emails such as password reset links and order confirmations.
- **stripe**: For integrating secure and seamless payment functionality.

---
This combination of tools and libraries ensures that the backend is reliable, secure, and easy to maintain, providing a strong foundation for the Shopeee platform.
---





