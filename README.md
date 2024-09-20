
## Auction System Backend - README

### Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technologies Used](#technologies-used)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running the Application](#running-the-application)
5. [API Documentation](#api-documentation)
6. [Unit Testing](#unit-testing)
7. [Thought Process](#Thought-Process)

---

### 1. Overview

This project is a backend service for an **Auction System**, built using **NestJS** with **MongoDB** as the primary database and **Redis** for caching. The application is containerized using **Docker**, making it easy to set up in various environments. 

The service provides endpoints for managing auctions, placing bids, and handling real-time data.

### 2. Architecture

The architecture follows a **layered approach**:
- **Controller Layer**: Manages incoming HTTP requests and WebSocket events.
- **Service Layer**: Contains business logic related to auctions and bids.
- **Database Layer**: Uses **MongoDB** (via **Mongoose**) for data persistence and **Redis** for caching.
- **Authentication**: Secured with **JWT** tokens and **RBAC** for access control (Future).

#### Key Architectural Decisions:
- **MongoDB**: Used for its flexibility and scalability in handling auction and bid data.
- **Redis**: Used to cache auction data to enhance performance and reduce the number of reads from MongoDB.
- **Docker**: Containers ensure consistency across environments, isolating services for better scalability.
- **Authentication (Future)**: Uses JWT for stateless authentication and supports role-based authorization for better security management.
- **WebSockets (Future)**: Designed to support real-time features for bid tracking and notifications.

---

### 3. Technologies Used

- **Node.js**: JavaScript runtime environment.
- **NestJS**: Framework for building efficient, scalable Node.js applications.
- **MongoDB**: NoSQL database for storing auction and bid data.
- **Redis**: In-memory data store for caching.
- **Docker**: Containerization of the app for isolated, scalable services.
- **Postman**: API testing and documentation.

---

### 4. Getting Started

#### 4.1 Prerequisites

- **Docker**: Ensure Docker is installed on your machine. Installation instructions can be found [here](https://docs.docker.com/get-docker/).

#### 4.2 Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Mravatech/solid-octo-barnacle.git
   cd solid-octo-barnacle
   ```

2. **Environment Variables**:
   Create a `.env` file in the root of your project and add the following:
   ```bash
   MONGO_URI=mongodb://root:example@mongodb:27017/auction_db?authSource=admin
   REDIS_HOST=redis
   REDIS_PORT=6379
   JWT_SECRET=your_jwt_secret
   ```

#### 4.3 Running the Application

To run the application using Docker, simply run:

```bash
docker-compose up --build
```

This will start the following services:
- **MongoDB**: Database for the auctions and bids.
- **Redis**: In-memory store for caching auction data.
- **NestJS App**: Auction service that provides APIs for managing auctions and bids.

---

### 5. API Documentation

The full API documentation is hosted on Postman and can be accessed here:

[Postman API Documentation](https://documenter.getpostman.com/view/1317561/2sAXqs83Mo)

This includes:
- Endpoints for creating auctions, placing bids, and fetching auction data.
- Descriptions for all API routes with example responses.
- Authorization requirements for restricted endpoints (e.g., JWT tokens for creating auctions or placing bids).

---

### 6. Unit Testing

The application includes unit tests written using **Jest**. Tests cover the core functionality of auctions, bids, and business logic, ensuring data consistency and proper handling of edge cases.

#### Running Unit Tests

To run the tests, execute:

```bash
npm run test
```

- **Test Coverage**: The tests ensure that auctions are created, bids are placed, and errors are properly handled.
- **Mocking**: Services like MongoDB and Redis are mocked to test the business logic independently of the actual database.

Sample test output:
```bash
PASS  src/auction/auction.service.spec.ts
✓ should create a new auction (300ms)
✓ should place a bid on an auction (150ms)
✓ should retrieve an auction by id (120ms)
✓ should throw an error if auction not found (50ms)
```




###  Thoughts Pocess

#### 1.Core Requirements:
  - **Auction Service**: A scalable backend service for managing auctions and bids.
  - **MongoDB as the Database**: MongoDB was chosen because it is a NoSQL database that provides excellent flexibility in managing evolving schemas. Auctions and bids can have variable structures, which fits well with MongoDB’s document-based model.
  - **Redis for Caching**: Redis is a high-performance, in-memory key-value store. It’s optimal for caching auction data (which is accessed frequently but changes less often), minimizing the load on MongoDB and improving performance.
  - *Docker for Containerization*: Docker ensures that all the services (NestJS, MongoDB, Redis) are isolated, reproducible, and portable across different environments.


#### 2. Considerations and Tradeoffs:

- ### Caching with Redis:

  - Why Redis? Redis improves performance by caching frequently requested data (e.g., auction listings). This reduces MongoDB queries, thus reducing latency for end users. I opted for Redis over in-memory Node.js caching because Redis provides a more scalable solution, especially in distributed environments.
  - Tradeoff: Redis can introduce data inconsistency if the cache is not carefully managed. However, by setting appropriate TTLs and using invalidation strategies, we mitigate stale data issues.

- ### MongoDB vs Relational Databases:

  - Why MongoDB? Auctions and bids are dynamic in nature and MongoDB’s flexible document model allows for evolving data schemas without needing complex migrations.
  - Tradeoff: MongoDB is eventually consistent, so strict transactional guarantees are not always available. However, for an auction system, this is acceptable as long as we ensure proper locking or bid placement order.

- ### Using Docker for Development and Deployment:

  - Why Docker? By containerizing the entire application (NestJS, Redis, MongoDB), we ensure consistency across development, staging, and production environments. Docker simplifies both local development and deployment pipelines by ensuring the same environment is reproducible anywhere.
  - Tradeoff: Containers introduce an additional overhead in terms of resource usage compared to running services natively. However, the benefit of environment parity and ease of orchestration outweighs the slight performance overhead for this project.

#### 3. Future Considerations

#### 1. **Authentication and Authorization**:
- **JWT Authentication**: The application can be enhanced by implementing **JWT-based authentication**. Each user would receive a token after logging in, which would then be used to authenticate all subsequent requests. Tokens will be validated before performing any actions like bidding or creating auctions.
- **RBAC (Role-Based Access Control)**: We will implement role-based access to distinguish between different types of users, such as **bidders**, **auctioneers**, and **admins**.


#### 2. **Real-Time Bidding with WebSockets**:
- The next iteration of the system could integrate WebSockets for real-time updates on auctions and bids. This allows users to receive live updates about ongoing bids and time remaining for auctions.
