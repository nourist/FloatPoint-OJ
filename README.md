# FloatPoint-OJ

![Watchers](https://img.shields.io/github/watchers/nourist/FloatPoint-OJ?style=social)
![Stars](https://img.shields.io/github/stars/nourist/FloatPoint-OJ?style=social)

A web application for online judge (algorithm questions), built with a modern tech stack including Next.js, NestJS, PostgreSQL, and Rust.

## ✨ Features

- 🔗 Separated frontend, backend, and judging system
- 🧑‍💻 User-friendly interface for solving and submitting coding problems
- 🔐 User authentication and role-based access control
- 💬 Blog system for sharing knowledge
- 📚 Problem management for admins (create, edit, delete problems)
- 📊 Submission statistics and user activity tracking
- 🏆 Contest system with real-time ranking
- 🖥️ Dedicated Admin Dashboard included
- 🌙 Light/Dark mode support
- 🌐 Internationalization support (i18n)
- 📦 Fully containerized with Docker Compose for easy deployment

## 🧩 Architecture

- ❗ Multi-judger system with RabbitMQ job queue for handling submission requests
- 🔒 Secure code execution using isolation techniques
- 🗃️ Test case storage using MinIO (S3-compatible object storage)
- 🔄 Real-time communication using WebSocket
- 📧 Email notifications for account verification and system updates
- 🎨 Rich text editor for problem descriptions and blog posts

## 🧱 Project Structure

```
FloatPoint-OJ/
├── client/              # Frontend (Next.js)
├── server/              # Backend API (NestJS)
├── judger/              # Automated judging system (Rust)
├── docker-compose.yml   # Orchestrates services using Docker
├── Dockerfile.*         # Docker configuration for each service
└── README.md
```

## 🛠 Tech Stack

### Frontend (Client)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn UI
- **State Management**: React Hooks
- **Rich Text Editor**: Tiptap
- **Code Editor**: CodeMirror
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

### Backend (Server)
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT + Passport.js
- **Message Queue**: RabbitMQ
- **Caching**: Redis
- **File Storage**: MinIO (S3-compatible)
- **Validation**: Class Validator
- **Documentation**: Swagger

### Judging System
- **Language**: Rust
- **Database**: PostgreSQL with SQLx
- **Message Queue**: RabbitMQ (lapin crate)
- **File Storage**: MinIO (AWS SDK for Rust)
- **Sandbox**: Docker with isolate for secure execution and isolation

## ☁️ External Services

This project uses the following third-party services:
- **Google Client API** — Used for authentication via Google OAuth 2.0
- **SMTP Server** — Email service for user verification

# 🚀 Getting Started

## Requirements

* [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
* [Node.js](https://nodejs.org/) (v18 or higher) - for local development
* [Rust](https://www.rust-lang.org/) (latest stable) - for local development of judger

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/nourist/FloatPoint-OJ.git
cd FloatPoint-OJ
```

### 2. Setting up the environment

Create a `.env` file in the root directory and define the necessary environment variables.

#### Required Environment Variables (root / production)

| Variable                       | Description            | Default     | Required                   |
| ------------------------------ | ---------------------- | ----------- | -------------------------- |
| `MAIL_USER`                    | SMTP server username   | None        | ✅                          |
| `MAIL_PASS`                    | SMTP server password   | None        | ✅                          |
| `MAIL_FROM_EMAIL`              | Sender email address   | None        | ✅                          |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | None        | ✅                          |
| `JWT_SECRET`                   | JWT secret key         | `secretKey` | ⚠️ (Change for production) |

> These are the values you must set for the app to function. For local development you may use test credentials (Mailtrap, dev Google OAuth), but change secrets for production.

#### Optional Environment Variables with Defaults (root / production)

These variables have sensible defaults; set them in the root `.env` for deployment.

---

##### Database (PostgreSQL)

| Variable  | Description       | Default                          |
| --------- | ----------------- | -------------------------------- |
| `DB_USER` | Database username | `postgres`                       |
| `DB_PASS` | Database password | `postgres`                       |
| `DB_NAME` | Database name     | `postgres`                       |
| `DB_HOST` | Database host     | `localhost` (Docker: `postgres`) |
| `DB_PORT` | Database port     | `5432`                           |

##### MinIO (S3-compatible storage)

| Variable           | Description      | Default                       |
| ------------------ | ---------------- | ----------------------------- |
| `MINIO_ACCESS_KEY` | MinIO access key | `minioadmin`                  |
| `MINIO_SECRET_KEY` | MinIO secret key | `minioadmin`                  |
| `MINIO_ENDPOINT`   | MinIO endpoint   | `localhost` (Docker: `minio`) |
| `MINIO_PORT`       | MinIO port       | `9000`                        |

##### RabbitMQ (Message queue)

| Variable        | Description       | Default                          |
| --------------- | ----------------- | -------------------------------- |
| `RABBITMQ_USER` | RabbitMQ username | `guest`                          |
| `RABBITMQ_PASS` | RabbitMQ password | `guest`                          |
| `RABBITMQ_HOST` | RabbitMQ host     | `localhost` (Docker: `rabbitmq`) |
| `RABBITMQ_PORT` | RabbitMQ port     | `5672`                           |

##### Redis

| Variable         | Description    | Default                       |
| ---------------- | -------------- | ----------------------------- |
| `REDIS_PASSWORD` | Redis password | `redispass`                   |
| `REDIS_HOST`     | Redis host     | `localhost` (Docker: `redis`) |
| `REDIS_PORT`     | Redis port     | `6379`                        |

##### Server Configuration

| Variable         | Description             | Default                              |
| ---------------- | ----------------------- | ------------------------------------ |
| `NODE_ENV`       | Application environment | `development` |
| `PORT`           | Server port             | `4000`                               |
| `CLIENT_URL`     | Frontend URL for CORS   | `http://localhost:3000`              |
| `JWT_EXPIRES_IN` | JWT token expiration    | `7d`                                 |
| `SALT_ROUNDS`    | Bcrypt salt rounds      | `10`                                 |
| `MAIL_HOST`      | SMTP server host        | `smtp.mailtrap.com`                  |
| `MAIL_PORT`      | SMTP server port        | `587`                                |

##### Client Configuration

| Variable              | Description                                | Default                                                |
| --------------------- | ------------------------------------------ | ------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL` | Backend API URL                            | `http://localhost:4000`                                |
| `API_URL`             | Backend API URL used for server components | `http://localhost:4000` (Docker: `http://server:4000`) |

### 3. Start services with Docker Compose

```bash
docker-compose up --build
```

**Note on Environment Variables with Docker:**

* Docker Compose will use default values for environment variables not explicitly set in your `.env` file.
* Required variables (like `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM_EMAIL`, and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`) must still be set.
* By default Docker Compose runs 2 judger instances with `JUDGER_ID` set to `1` and `2`.
* For production deployment, always override default secrets and keys.
* Variables that differ between Docker and manual setup:

  * Database host: `postgres` (Docker) vs. `localhost` (manual)
  * MinIO endpoint: `minio` (Docker) vs. `localhost` (manual)
  * RabbitMQ host: `rabbitmq` (Docker) vs. `localhost` (manual)
  * Redis host: `redis` (Docker) vs. `localhost` (manual)
  * Api URL: `http://server:4000` (Docker) vs. `http://localhost:4000` (manual)

### 4. Access the application

* Frontend: [http://localhost:3000](http://localhost:3000)
* API: [http://localhost:4000](http://localhost:4000)
* MinIO Console: [http://localhost:9001](http://localhost:9001)
* RabbitMQ Management: [http://localhost:15672](http://localhost:15672)

---

## Manual Setup (Development)

If you prefer to run services manually for development:

### 1. Prerequisites Setup

* Install PostgreSQL, MinIO, RabbitMQ, and Redis.
* Configure each service with the appropriate settings from the development environment variable tables below.

### 2. Email Service Setup

* Configure an SMTP service (e.g., Mailtrap for development).
* Set the required email environment variables: `MAIL_USER`, `MAIL_PASS`, and `MAIL_FROM_EMAIL` in the server service's `.env` file.

### 3. Authentication Setup

* Create a Google OAuth client ID for Google login and set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `client/.env`.

### 4. Development Environment Variables (Service-Specific)

Place these `.env` files inside each service directory when running services locally.

#### Client Service (`client/.env`)

| Variable                       | Description                                | Required                                       |
| ------------------------------ | ------------------------------------------ | ---------------------------------------------- |
| `NEXT_PUBLIC_API_URL`          | Backend API URL                            | Optional (defaults to `http://localhost:4000`) |
| `API_URL`                      | Backend API URL used for server components | Optional (defaults to `http://localhost:4000`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID                     | ✅ Required                                     |

#### Server Service (`server/.env`)

| Variable           | Description             | Required                                       |
| ------------------ | ----------------------- | ---------------------------------------------- |
| `NODE_ENV`         | Application environment | Optional (defaults to `development`)           |
| `PORT`             | Server port             | Optional (defaults to `4000`)                  |
| `CLIENT_URL`       | Frontend URL for CORS   | Optional (defaults to `http://localhost:3000`) |
| `JWT_SECRET`       | JWT secret key          | Optional (defaults to `secretKey`)             |
| `JWT_EXPIRES_IN`   | JWT token expiration    | Optional (defaults to `7d`)                    |
| `SALT_ROUNDS`      | Bcrypt salt rounds      | Optional (defaults to `10`)                    |
| `DB_HOST`          | Database host           | Optional (defaults to `localhost`)             |
| `DB_PORT`          | Database port           | Optional (defaults to `5432`)                  |
| `DB_USER`          | Database username       | Optional (defaults to `postgres`)              |
| `DB_PASS`          | Database password       | Optional (defaults to `postgres`)              |
| `DB_NAME`          | Database name           | Optional (defaults to `postgres`)              |
| `RABBITMQ_HOST`    | RabbitMQ host           | Optional (defaults to `localhost`)             |
| `RABBITMQ_PORT`    | RabbitMQ port           | Optional (defaults to `5672`)                  |
| `RABBITMQ_USER`    | RabbitMQ username       | Optional (defaults to `guest`)                 |
| `RABBITMQ_PASS`    | RabbitMQ password       | Optional (defaults to `guest`)                 |
| `MAIL_HOST`        | SMTP server host        | Optional (defaults to `smtp.mailtrap.com`)     |
| `MAIL_PORT`        | SMTP server port        | Optional (defaults to `587`)                   |
| `MAIL_USER`        | SMTP server username    | ✅ Required                                     |
| `MAIL_PASS`        | SMTP server password    | ✅ Required                                     |
| `MAIL_FROM_EMAIL`  | Sender email address    | ✅ Required                                     |
| `MINIO_ENDPOINT`   | MinIO endpoint          | Optional (defaults to `localhost`)             |
| `MINIO_PORT`       | MinIO port              | Optional (defaults to `9000`)                  |
| `MINIO_ACCESS_KEY` | MinIO access key        | Optional (defaults to `minioadmin`)            |
| `MINIO_SECRET_KEY` | MinIO secret key        | Optional (defaults to `minioadmin`)            |
| `REDIS_HOST`       | Redis host              | Optional (defaults to `localhost`)             |
| `REDIS_PORT`       | Redis port              | Optional (defaults to `6379`)                  |
| `REDIS_PASSWORD`   | Redis password          | Optional (defaults to `redispass`)             |

#### Judger Service (`judger/.env`)

| Variable           | Description                                                          | Required                            |
| ------------------ | -------------------------------------------------------------------- | ----------------------------------- |
| `JUDGER_ID`        | Unique identifier for the judger instance (number from `0` to `255`) | ✅ Required                          |
| `DB_HOST`          | Database host                                                        | Optional (defaults to `localhost`)  |
| `DB_USER`          | Database username                                                    | Optional (defaults to `postgres`)   |
| `DB_PASS`          | Database password                                                    | Optional (defaults to `postgres`)   |
| `DB_NAME`          | Database name                                                        | Optional (defaults to `postgres`)   |
| `MINIO_ENDPOINT`   | MinIO endpoint                                                       | Optional (defaults to `localhost`)  |
| `MINIO_ACCESS_KEY` | MinIO access key                                                     | Optional (defaults to `minioadmin`) |
| `MINIO_SECRET_KEY` | MinIO secret key                                                     | Optional (defaults to `minioadmin`) |
| `RABBITMQ_HOST`    | RabbitMQ host                                                        | Optional (defaults to `localhost`)  |
| `RABBITMQ_USER`    | RabbitMQ username                                                    | Optional (defaults to `guest`)      |
| `RABBITMQ_PASS`    | RabbitMQ password                                                    | Optional (defaults to `guest`)      |

### 5. Start Services Locally

```bash
# Judger Service
cd judger
# Create .env file with required variables from the Judger Service table
cargo run
```

```bash
# Server Service
cd server
# Create .env file with required variables from the Server Service table
npm install
npm run dev
```

```bash
# Client Service
cd client
# Create .env file with required variables from the Client Service table
npm install
npm run dev
```

## 📸 Screenshots

![Client-Home](./screenshots/client-1-light.png#gh-light-mode-only)
![Client-Home](./screenshots/client-1-dark.png#gh-dark-mode-only)

![Client-Problems](./screenshots/client-2-light.png#gh-light-mode-only)
![Client-Problems](./screenshots/client-2-dark.png#gh-dark-mode-only)

![Client-Submissions](./screenshots/client-3-light.png#gh-light-mode-only)
![Client-Submissions](./screenshots/client-3-dark.png#gh-dark-mode-only)

![Client-Contests](./screenshots/client-4-light.png#gh-light-mode-only)
![Client-Contests](./screenshots/client-4-dark.png#gh-dark-mode-only)

![Client-Users](./screenshots/client-5-light.png#gh-light-mode-only)
![Client-Users](./screenshots/client-5-dark.png#gh-dark-mode-only)

![Admin-Dashboard](./screenshots/admin-1-light.png#gh-light-mode-only)
![Admin-Dashboard](./screenshots/admin-1-dark.png#gh-dark-mode-only)

![Admin-Problems](./screenshots/admin-2-light.png#gh-light-mode-only)
![Admin-Problems](./screenshots/admin-2-dark.png#gh-dark-mode-only)

![Admin-Users](./screenshots/admin-3-light.png#gh-light-mode-only)
![Admin-Users](./screenshots/admin-3-dark.png#gh-dark-mode-only)

![Admin-Submissions](./screenshots/admin-4-light.png#gh-light-mode-only)
![Admin-Submissions](./screenshots/admin-4-dark.png#gh-dark-mode-only)

![Admin-Contests](./screenshots/admin-5-light.png#gh-light-mode-only)
![Admin-Contests](./screenshots/admin-5-dark.png#gh-dark-mode-only)

![Admin-Judgers](./screenshots/admin-6-light.png#gh-light-mode-only)
![Admin-Judgers](./screenshots/admin-6-dark.png#gh-dark-mode-only)

![Admin-Notifications](./screenshots/admin-7-light.png#gh-light-mode-only)
![Admin-Notifications](./screenshots/admin-7-dark.png#gh-dark-mode-only)

And much more for you to explore...

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or suggestions.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the [MIT](LICENSE) License.

---

I know that this project still has many bugs and the design is a mess. However, I'm happy with my final product.

This project is created and maintained by [Nourist](https://github.com/nourist). If you enjoy this tool, feel free to give it a star on GitHub!
