# SafeCampus – Smart Campus Safety & Emergency Response System

A full-stack MVP based on the uploaded technical-training specification. The source specifies Java/Spring Boot, React, MySQL, Spring Security + JWT, REST APIs, JPA/Hibernate, incident routing, dashboards, notifications and optional AI/NLP. See the supplied PDF for the original architecture and requirements.

## Stack
- Backend: Java 17, Spring Boot 3, Spring Data JPA, Spring Security
- Frontend: React + Vite
- Database: MySQL 8
- API: REST
- Optional AI/NLP: left as an extension point

## Run
### 1. Database
Create a MySQL database named `safecampus`, then run `database/schema.sql`.

### 2. Backend
Set environment variables if needed:
`DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`

From `backend/`:
`mvn spring-boot:run`

Backend runs on `http://localhost:8080`.

### 3. Frontend
From `frontend/`:
`npm install`
`npm run dev`

Frontend runs on `http://localhost:5173`.

## Main API endpoints
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/incidents`
- POST `/api/incidents`
- PUT `/api/incidents/{id}/status`
- PUT `/api/incidents/{id}/assign`
- GET `/api/incidents/stats`

This is an MVP intended for academic project demonstration. Production deployment should add refresh tokens, stronger validation, audit logging, rate limiting, file/object storage, email/SMS provider integration and real AI classification.
