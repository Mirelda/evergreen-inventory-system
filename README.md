# Evergreen Inventory - Inventory Management System

A modern inventory management platform built with Next.js, Prisma (with MongoDB), and NextAuth.js. It features a role-based authentication system and detailed inventory tracking.

## Project Structure

```
evergreen-inventory/
├── app/
│   ├── (back-office)/ # Management dashboard UI
│   ├── api/           # API endpoints
│   ├── login/         # Login page
│   └── register/      # Registration page
├── components/        # Reusable React components
├── lib/               # Helper functions and configurations (database, auth)
├── prisma/            # Database schema (schema.prisma)
└── public/            # Static assets (images, etc.)
```

## Technologies

*   **Framework:** Next.js 15 (with App Router)
*   **Database:** MongoDB
*   **ORM:** Prisma
*   **Authentication:** NextAuth.js
*   **Styling:** Tailwind CSS & Sass
*   **UI Components:** Radix UI
*   **Form Management:** React Hook Form
*   **File Uploads:** UploadThing

## Setup and Launch

1.  Navigate to the project directory:
    ```bash
    cd evergreen-inventory
    ```

2.  Install the required packages:
    ```bash
    npm install
    ```

3.  Create a file named `.env` and fill in the following variables with your own MongoDB connection details:

    ```env
    # Database Configuration
    DATABASE_URL="mongodb+srv://<user>:<password>@<cluster-url>/<db-name>?retryWrites=true&w=majority"

    # NextAuth.js Configuration
    NEXTAUTH_SECRET="your_secret_key_here"
    NEXTAUTH_URL="http://localhost:3000"

    # UploadThing Configuration
    UPLOADTHING_SECRET="your_uploadthing_secret"
    UPLOADTHING_APP_ID="your_uploadthing_app_id"
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```

    When the server starts, it will synchronize with the Prisma database, and your application will be running at `http://localhost:3000`.

## Role-Based Authentication System

#### User Roles

*   **STAFF (Default):** Can perform basic inventory operations.
*   **MANAGER:** Has user management and broader permissions.
*   **ADMIN:** Has full control over the entire platform.

#### Authentication Flow

1.  Users register with the `STAFF` role by default.
2.  Users with `ADMIN` or `MANAGER` roles can update the roles of other users.
3.  Access to pages and API endpoints is restricted based on the user's role using `middleware.js` and NextAuth.js callbacks.

## API Endpoints (Examples)

The project provides RESTful API endpoints using the Next.js App Router structure.

#### Authentication

*   **User Registration:** `POST /api/register`
*   **User Login:** `POST /api/auth/callback/credentials` (Handled by NextAuth)
*   **Session Info:** `GET /api/auth/session` (Handled by NextAuth)

#### Inventory Management

*   **List/Add Items:** `GET /api/items`, `POST /api/items`
*   **Get/Update/Delete a Single Item:** `GET /api/items/[id]`, `PATCH /api/items/[id]`, `DELETE /api/items/[id]`
*   **Categories:** `GET /api/categories`, `POST /api/categories`
*   **Brands:** `GET /api/brands`, `POST /api/brands`
*   **Stock Adjustments:** `POST /api/adjustments/add`, `POST /api/adjustments/transfer`

## Database Schema

Database models are defined in the `prisma/schema.prisma` file. The main models are:

*   `User`: User information and roles.
*   `Item`: Products in the inventory (stock quantity, price, category, etc.).
*   `Category`, `Brand`, `Unit`: Helper models for organizing products.
*   `Warehouse`: Warehouses where stock is kept.
*   `AddStockAdjustment`, `TransferStockAdjustment`: Stock entry and transfer records.
*   `Sale`: Sales transactions.
