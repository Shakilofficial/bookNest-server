![BookNest](https://res.cloudinary.com/dcyupktj6/image/upload/v1738244043/2_gbkou2.png)

BookNest is a powerful and scalable backend service designed for an online bookstore. Built with Node.js, Express, MongoDB, and TypeScript, this project provides a robust API for managing users, books, orders, and administrative functions with full CRUD capabilities.

## Features

- **User Authentication & Authorization**: Secure JWT-based authentication with role-based access control.
- **User Management**: Users can register, log in, and update profiles. Admins can manage users.
- **Book Management**: Admins can add, update, delete books, and users can browse and search for books.
- **Order Processing**: Users can place orders, and admins can manage order statuses.
- **Global Error Handling**: Custom error handling with detailed responses.
- **Zod Validation**: Type-safe validation library ensuring data integrity.
- **Advanced Querying**: Filtering, searching, and pagination for books and orders.

---

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **npm**: Node package manager
- **MongoDB**: Local instance or MongoDB Atlas

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/Shakilofficial/booknest-backend.git
   cd booknest-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/booknest
   JWT_SECRET=your_jwt_secret_key
   ```
4. Compile TypeScript:
   ```sh
   npm run build
   ```
5. Start the server:
   - Development:
     ```sh
     npm run dev
     ```
   - Production:
     ```sh
     npm run start:prod
     ```

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | `/api/auth/register` | Register a new user   |
| POST   | `/api/auth/login`    | Login and get a token |

### User Management

| Method | Endpoint         | Description                                 |
| ------ | ---------------- | ------------------------------------------- |
| GET    | `/api/users`     | Get all users (Admin only)                  |
| GET    | `/api/users/:id` | Get user profile (Admin/User themselves)    |
| PUT    | `/api/users/:id` | Update user profile (Admin/User themselves) |

### Book Management

| Method | Endpoint         | Description                               |
| ------ | ---------------- | ----------------------------------------- |
| GET    | `/api/books`     | Retrieve all books (with search & filter) |
| POST   | `/api/books`     | Create a new book (Admin only)            |
| GET    | `/api/books/:id` | Retrieve a book by its ID                 |
| PUT    | `/api/books/:id` | Update a book (Admin only)                |
| DELETE | `/api/books/:id` | Delete a book (Admin only)                |

### Order Management

| Method | Endpoint          | Description                      |
| ------ | ----------------- | -------------------------------- |
| GET    | `/api/orders`     | Get all orders (Admin only)      |
| POST   | `/api/orders`     | Place a new order                |
| GET    | `/api/orders/:id` | Get order details                |
| PUT    | `/api/orders/:id` | Update order status (Admin only) |
| DELETE | `/api/orders/:id` | Cancel order (User/Admin)        |

### Admin Routes

| Method | Endpoint                | Description                  |
| ------ | ----------------------- | ---------------------------- |
| DELETE | `/api/admin/users/:id`  | Delete a user (Admin only)   |
| DELETE | `/api/admin/orders/:id` | Delete an order (Admin only) |

---

## Authentication

### Register User

**POST** `/api/auth/register`

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (Success 201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string"
  }
}
```

### Login User

**POST** `/api/auth/login`

**Request:**

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (Success 200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here"
  }
}
```

---

## Error Handling

BookNest implements a global error handling system to ensure smooth user experience. Below are some common error types:

| Error Type              | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `ZOD_ERROR`             | Data validation error using Zod                |
| `NOT_FOUND_ERROR`       | Requested resource (book/user/order) not found |
| `VALIDATION_ERROR`      | Missing or incorrect data format               |
| `AUTH_ERROR`            | Invalid credentials or unauthorized access     |
| `AUTHORIZATION_ERROR`   | User lacks required permissions                |
| `INTERNAL_SERVER_ERROR` | Unhandled server issues                        |

---

## Contribution Guidelines

If you would like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request with proper documentation and testing.

---

## Contact

For questions or collaborations, contact me via:

- **Email**: mrshakilhossain@outlook.com
- **LinkedIn**: [LinkedIn Profile](https://www.linkedin.com/in/your-profile)
- **Facebook**: [Facebook Profile](https://www.facebook.com/iamshakilhossain)
- **Portfolio**: [Portfolio Website](https://shakilhossain-sigma.vercel.app)

---

## License

This project is **MIT licensed**.

---

BookNest - Simplifying Online Book Shopping 📚🚀
