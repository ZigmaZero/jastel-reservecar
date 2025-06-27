# Step 1 : Frontend Build
FROM node:22.16.0 AS frontend-builder

WORKDIR /app

# Build-time frontend envs
ARG VITE_LINE_CLIENT_ID
ARG VITE_REDIRECT_URI

# Copy the frontend repository
COPY frontend frontend

# Set build envs for frontend
ENV VITE_LINE_CLIENT_ID=$VITE_LINE_CLIENT_ID
ENV VITE_REDIRECT_URI=$VITE_REDIRECT_URI

# Install the frontend dependencies
RUN cd frontend && npm install

# Build the frontend application
RUN cd frontend && npm run build

# Step 2 : Backend Build
FROM node:22.16.0 AS backend-builder

WORKDIR /app

# Clone the backend repository
COPY backend backend

# Install backend dependencies
RUN cd backend && npm install

# Copy the built frontend files into the backend directory
COPY --from=frontend-builder /app/frontend/dist /app/backend/frontend/dist

WORKDIR /app/backend

# Database persistence
VOLUME /app/backend/database

# Mount point for secrets
VOLUME /app/backend/.env

EXPOSE 3000

CMD ["npm", "run", "stage"]