# Lienzo - Enterprise Software License Management System

## Overview

Lienzo is a comprehensive enterprise-level software license management system designed to streamline the process of purchasing, managing, and tracking software licenses for businesses of all sizes. Built with Next.js, TypeScript, and Prisma, Lienzo offers a robust and user-friendly platform for both license administrators and end-users.

## Key Features

1. **User Authentication and Role Management**
2. **License Management**
3. **Product Catalog**
4. **License Request System**
5. **Admin Dashboard**
6. **User Dashboard**
7. **Reporting and Analytics**

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: Kinde Auth
- **UI Components**: Tailwind CSS, shadcn/ui
- **State Management**: React Query
- **Form Handling**: React Hook Form
- **Date Handling**: Day.js

Project knowledge
## Project Structure

- `/app`: Next.js app directory containing pages and API routes
- `/components`: Reusable React components
- `/lib`: Utility functions and shared logic
- `/prisma`: Database schema and migrations
- `/public`: Static assets
- `/types`: TypeScript type definitions

## Database Schema

```mermaid
erDiagram
    User ||--o{ License : has
    User ||--o{ LicenseRequest : makes
    Product ||--o{ License : has
    Product ||--o{ LicenseRequest : for
    User ||--o{ UserPermission : has
    Permission ||--o{ UserPermission : grants
    Permission ||--o{ RolePermission : grants

    User {
        string id PK
        string firstName
        string lastName
        string email
        string phoneNumber
        string role
        boolean newUser
        datetime createdAt
        datetime updatedAt
    }

    License {
        string id PK
        string key
        string productId FK
        string ownerId FK
        int duration
        datetime startDate
        datetime expiryDate
        datetime createdAt
        datetime updatedAt
        string requestId FK
    }

    Product {
        string id PK
        string name
        string description
        string features
        bytes image
        string durations
    }

    LicenseRequest {
        string id PK
        string userId FK
        string productId FK
        int quantity
        int duration
        string message
        string companyName
        string status
        datetime createdAt
        datetime updatedAt
    }

    Permission {
        string id PK
        string name
        string description
    }

    UserPermission {
        string id PK
        string userId FK
        string permissionId FK
    }

    RolePermission {
        string id PK
        string role
        string permissionId FK
    }
```

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/lienzo.git
   cd lienzo
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required variables, including Kinde Auth credentials

4. Set up the database:
   ```
   npx prisma generate
   npx prisma migrate dev
   ```

5. (Optional) Seed the database with initial data:
   ```
   npx prisma db seed
   ```

6. Start the development server:
   ```
   npm run dev
   ```

7. Open `http://localhost:3000` in your browser to view the application

## Deployment

The project is designed to be deployed on Vercel or similar platforms that support Next.js applications.

## App Structure & Features (Elaborated)

### User Authentication and Authorization
- User registration and login via Kinde Auth
- Role-based access control (USER, MANAGER, SUPPORT, ADMIN)
- Custom middleware for route protection

### Dashboard
- Overview of user's licenses
- Display of total, active, pending renewal, and expired licenses

### License Management
- Viewing individual license details
- License key visibility toggle and copy functionality

### Store
- Product listing
- Individual product pages with detailed information
- Product creation and editing (admin functionality)

### License Request System
- Users can request licenses for products
- Admins can review and manage license requests

### User Management (Admin)
- View all users
- Change user roles

### Settings (Admin)
- Manage license durations

### API Endpoints
- User synchronization with Kinde
- CRUD operations for products
- License request handling
- User role management

### Responsive UI
- Mobile-friendly design using Tailwind CSS

### Client-side State Management
- React Query for data fetching and caching

### Server-side Rendering
- Next.js App Router for improved performance and SEO

### Database Integration
- Prisma ORM with SQLite database

### Custom UI Components
- Reusable components like modals, cards, and form elements

### Toasts for Notifications
- User feedback for actions (success, error messages)

### Multi-step Forms
- For complex user inputs like getting quotes

### Image Handling
- Product image upload and display

### Caching System
- Server-side caching for improved performance

### Permission System
- Fine-grained access control based on user roles and permissions

### Public Pages
- Home page with feature highlights
- About Us page
- FAQ page
- Contact page

### Error Handling
- Custom error messages and handling for API requests

## Future Enhancements

- Integration with popular software vendors for automated license provisioning
- Advanced analytics and reporting features
- Multi-tenant support for managing licenses across different organizations
- Mobile app for on-the-go license management

## Contributing

Contributions are welcome! Please read our contributing guidelines and code of conduct before submitting pull requests.

## License

[MIT License](LICENSE)

## Tech Team

Developed by OonkoO - [https://oonkoo.com](https://oonkoo.com)

---

Lienzo - Empowering businesses with efficient software license management.