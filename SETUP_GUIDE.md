# Hyrex AI - Project Setup & Demo Guide

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Quick Start (Docker)](#quick-start-docker)
5. [Local Development (Without Docker)](#local-development-without-docker)
6. [Test Credentials](#test-credentials)
7. [API Endpoints](#api-endpoints)
8. [Features](#features)
9. [Environment Variables](#environment-variables)
10. [Troubleshooting](#troubleshooting)

---

## Overview

Hyrex AI is an AI-powered SaaS platform for voice and HR automation, featuring:

- **Speech to Text** - Transcribe audio files with multi-language support
- **Text to Speech** - Convert text to natural-sounding audio with emotion control
- **Voice Clone** - Clone any voice from a reference audio sample and synthesize new speech
- **Resume Screening** - AI-powered resume analysis and candidate ranking
- **API Keys Management** - Manage API access credentials
- **Billing & Subscription** - Subscription management

---

## Architecture

```
                    +-----------+
                    |  Browser  |
                    +-----+-----+
                          |
                    Port 80 (nginx)
                          |
                  +-------+-------+
                  |   Frontend    |
                  |  React/Vite   |
                  |   (nginx)     |
                  +-------+-------+
                          |
                   /api/* proxy
                          |
                  +-------+-------+
                  |    Backend    |       +------------------+
                  |   FastAPI     +------>|  Modal (Cloud)   |
                  |  Port 8000    |       |  - TTS API       |
                  +-------+-------+       |  - Voice Clone   |
                          |               +------------------+
                  +-------+-------+
                  |   Database    |
                  |  PostgreSQL   |
                  |  Port 5432    |
                  +---------------+
```

### Services

| Service      | Technology       | Port  | Purpose                          |
|-------------|-----------------|-------|----------------------------------|
| **frontend** | React + Nginx   | 80    | Web UI                           |
| **backend**  | FastAPI + Python | 8000  | REST API                         |
| **db**       | PostgreSQL 16   | 5432  | Data storage                     |
| **migrate**  | Alembic         | -     | Database migrations (one-shot)   |
| **seed**     | Python script   | -     | Create test users (one-shot)     |

---

## Prerequisites

### For Docker Setup (Recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v20+)
- [Docker Compose](https://docs.docker.com/compose/) (v2+)
- Git

### For Local Development
- Python 3.12+
- Node.js 18+ and npm
- PostgreSQL 16
- FFmpeg (for audio conversion)
- Git

---

## Quick Start (Docker)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hyrex_ai
```

### 2. Start All Services

```bash
docker-compose up --build
```

This single command will:
1. Start PostgreSQL database
2. Run database migrations (Alembic)
3. Seed test users
4. Start the FastAPI backend
5. Build and serve the React frontend

### 3. Wait for Health Checks

Watch the logs until you see all services healthy:

```
backend-1   | INFO:     Application startup complete.
frontend-1  | ... nginx ready ...
```

### 4. Open the Application

| URL | Description |
|-----|------------|
| http://localhost | Frontend (main app) |
| http://localhost:8000/docs | API documentation (Swagger) |
| http://localhost:8000/health | Backend health check |

### 5. Sign In

Use the test credentials below to sign in at http://localhost

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v
```

### Rebuilding After Code Changes

```bash
# Rebuild and restart all
docker-compose up --build

# Rebuild only backend
docker-compose up --build backend

# Rebuild only frontend
docker-compose up --build frontend
```

---

## Local Development (Without Docker)

### 1. Database Setup

Make sure PostgreSQL is running locally, then create the database:

```bash
psql -U postgres -c "CREATE DATABASE fastapi_db;"
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy local environment config
copy .env.local .env        # Windows
# cp .env.local .env        # macOS/Linux

# Run database migrations
alembic upgrade head

# Seed test users
python -m app.scripts.seed_test_user

# Start the backend server
python run.py
```

Backend will be available at http://localhost:8000

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend will be available at http://localhost:5173 (or http://localhost:8080)

---

## Test Credentials

| Email | Password | Role |
|-------|----------|------|
| test@hyrex.ai | Test@123456 | Test User |
| tejas@hyrex.ai | Hyrex@2026 | Admin |

---

## API Endpoints

### Health & Info
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/docs` | Swagger API documentation |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Sign in |
| POST | `/api/v1/auth/refresh` | Refresh access token |

### Text to Speech
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/tts/generate` | Generate speech from text |
| GET | `/api/v1/tts/generations` | List past generations |
| GET | `/api/v1/tts/generations/{id}/download` | Download audio file |

### Voice Clone
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/voice-clone/synthesize` | Synthesize speech with cloned voice |
| GET | `/api/v1/voice-clone/syntheses` | List past syntheses |
| GET | `/api/v1/voice-clone/syntheses/{id}/download` | Download cloned audio |

**Voice Clone - POST `/api/v1/voice-clone/synthesize`**

Form data (multipart):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reference_audio` | File | Yes | Reference voice audio (WAV, MP3, WebM, etc. - auto-converted to WAV) |
| `target_text` | string | Yes | Text to synthesize (1-5000 chars) |
| `clone_name` | string | No | Name for the clone (default: "Voice Clone") |
| `language` | string | No | Language (default: "English") |
| `speed` | float | No | Speed 0.5-2.0 (default: 1.0) |
| `nfe_step` | int | No | NFE steps 4-64 (default: 10) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/me` | Get current user profile |

---

## Features

### Voice Clone (Demo Walkthrough)

1. Navigate to **Voice Clone** from the sidebar
2. **Upload reference audio** - drag & drop or click to browse (MP3, WAV, WebM, M4A, FLAC supported)
   - Or click the **microphone icon** to record directly from your browser
3. **Enter target text** - type the text you want spoken in the cloned voice
4. Optionally set a **clone name** and **language**
5. Click **"Synthesize Voice"**
6. Wait for synthesis (~10-40 seconds, first call may take longer due to cold start)
7. Audio auto-plays with animated waveform
8. Use **Play/Pause**, **Stop**, and **Download** controls
9. Past syntheses appear in the **Recent Syntheses** section below

### Text to Speech (Demo Walkthrough)

1. Navigate to **Text to Speech** from the sidebar
2. Enter text in the text area (up to 5000 characters)
3. Select a **voice** (e.g., Nisha - Indian Female)
4. Choose an **emotion** (Default, Neutral, Warm, Empathetic, Laugh)
5. Adjust **speed** with the slider (0.5x - 2.0x)
6. Click **"Generate Audio"**
7. Audio auto-plays with waveform visualization

### Speech to Text (Demo)

1. Navigate to **Speech to Text** from the sidebar
2. Upload an audio file or use the microphone
3. Select target language
4. View transcription results with confidence score

---

## Environment Variables

### Backend (.env)

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_NAME` | Hyrex AI | Application name |
| `ENVIRONMENT` | production | Environment mode (development/production) |
| `DEBUG` | false | Debug mode |
| `POSTGRES_HOST` | db (Docker) / localhost (local) | Database host |
| `POSTGRES_PORT` | 5432 | Database port |
| `POSTGRES_USER` | postgres | Database user |
| `POSTGRES_PASSWORD` | postgres | Database password |
| `POSTGRES_DB` | fastapi_db | Database name |
| `CORS_ORIGINS` | (see .env) | Allowed CORS origins (comma-separated) |
| `CORS_ALLOW_HEADERS` | * | Allowed CORS headers |
| `SECRET_KEY` | (change this) | JWT signing key |
| `MODAL_TTS_ENDPOINT_URL` | (your Modal URL) | Modal TTS API endpoint |
| `MODAL_TTS_API_KEY` | (your key) | Modal TTS API key |
| `TTS_MEDIA_DIR` | media/tts | Directory for TTS audio files |
| `TTS_REQUEST_TIMEOUT` | 60 | TTS API timeout in seconds |

### Frontend (.env)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | http://localhost:8000 | Backend API URL |
| `VITE_APP_NAME` | Hyrex AI | App name shown in UI |

---

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:
- Ensure your frontend origin is listed in `CORS_ORIGINS` in the backend `.env`
- Example: `CORS_ORIGINS=http://localhost,http://localhost:80,http://localhost:8080`
- Restart the backend after changing `.env`

### Voice Clone - "Voice clone service timed out"

- The first API call to Modal triggers a **cold start** (~37 seconds)
- Simply **retry** the request — subsequent calls are fast
- You can warm up the service by visiting the Modal health endpoint first

### Voice Clone - 400 "invalid audio format"

- The backend auto-converts uploaded audio to WAV format
- Ensure **FFmpeg** is installed (included in Docker image)
- Supported upload formats: MP3, WAV, M4A, FLAC, WebM, OGG, AAC

### Database Connection Failed

- **Docker**: Ensure the `db` service is healthy: `docker-compose ps`
- **Local**: Ensure PostgreSQL is running on localhost:5432
- Check `POSTGRES_HOST` in `.env` — use `db` for Docker, `localhost` for local

### Frontend Not Loading

- **Docker**: Check if nginx is running: `docker-compose logs frontend`
- **Local**: Ensure `npm run dev` is running and check the port in the terminal output
- Clear browser cache and hard refresh (Ctrl+Shift+R)

### "Application startup failed"

- Usually a database connection issue
- Check if PostgreSQL is accessible with the configured credentials
- For Docker: run `docker-compose up db` first and wait for it to be healthy

### Rebuilding from Scratch

```bash
# Remove everything and start fresh
docker-compose down -v
docker-compose up --build
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, Radix UI, React Router |
| Backend | FastAPI, SQLAlchemy, Alembic, Pydantic, httpx, pydub |
| Database | PostgreSQL 16 |
| Audio | FFmpeg, pydub (server-side conversion) |
| AI Services | Modal (TTS, Voice Clone) |
| Deployment | Docker, Docker Compose, Nginx |

---

## Docker Volumes

| Volume | Purpose |
|--------|---------|
| `postgres_data` | PostgreSQL data persistence |
| `backend_media` | Generated audio files (TTS + Voice Clone) |
| `backend_logs` | Application logs |

These volumes persist data across container restarts. Use `docker-compose down -v` to reset.
