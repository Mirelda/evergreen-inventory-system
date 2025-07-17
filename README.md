This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authorization Architecture

This project implements a Role-Based Access Control (RBAC) system to manage user permissions. The system is built using NextAuth.js, Prisma, and MongoDB.

### Core Technologies

- **NextAuth.js**: Handles user authentication, including sign-in, sign-out, and session management.
- **Prisma**: Serves as the ORM for database interactions. User and role data are stored in a MongoDB database.
- **MongoDB**: A flexible and scalable NoSQL database used for data persistence.

### Role Hierarchy

The system defines three primary user roles:

1.  **`ADMIN`**: The highest-level role with full system access.
    - Can manage all system settings and features.
    - Has full control over user management (assigning roles, deleting users).
    - Inherits all permissions from `MANAGER` and `STAFF`.

2.  **`MANAGER`**: An intermediate-level role for administrative tasks.
    - Manages inventory, sales, and purchases.
    - Can access reports and documents.
    - Has all permissions of the `STAFF` role, with the additional ability to delete records.

3.  **`STAFF`**: The base-level user role.
    - New users are assigned this role by default upon registration.
    - Can perform essential tasks like creating and editing inventory items and sales.
    - Can manage their own user settings.

### Authorization Flow

Authorization is enforced on both the server-side (via middleware) and the client-side (via UI components).

- **`middleware.js`**: This file protects routes based on user roles. It intercepts requests to secured pages and verifies the user's session and role. Unauthorized access attempts are redirected to the login page or an error page.

- **Dynamic UI Rendering**:
    - **`Sidebar.jsx`**: Navigation links in the sidebar are dynamically rendered based on the user's role. For example, a `STAFF` user will only see links to pages they are permitted to access.
    - **`DataTable.jsx`**: Action buttons within data tables (e.g., "Add New," "Edit," "Delete") are conditionally rendered according to the user's permissions. This prevents users from seeing or attempting actions they are not authorized to perform.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
