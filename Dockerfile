# Step 1 : Frontend Build
FROM node:22.16.0 AS frontend-builder

WORKDIR /app

# Build-time frontend envs
ARG VITE_LINE_CLIENT_ID
ARG VITE_REDIRECT_URI

# Clone the frontend repository
RUN git clone https://github.com/ZigmaZero/reservecar-frontend.git frontend

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

# Build-time backend envs
ARG DATABASE_NAME
ARG TOKEN_SECRET
ARG LINE_CLIENT_SECRET
ARG LINE_CLIENT_ID
ARG LINE_MESSAGING_API_ACCESS_TOKEN

# Clone the backend repository
RUN git clone https://github.com/ZigmaZero/reservecar-backend.git backend

# Set build envs for backend
ENV DATABASE_NAME=$DATABASE_NAME
ENV TOKEN_SECRET=$TOKEN_SECRET
ENV LINE_CLIENT_SECRET=$LINE_CLIENT_SECRET
ENV LINE_CLIENT_ID=$LINE_CLIENT_ID
ENV LINE_MESSAGING_API_ACCESS_TOKEN=$LINE_MESSAGING_API_ACCESS_TOKEN

# Install the backend dependencies
RUN cd backend && npm install

# Copy the built frontend files into the backend directory
COPY --from=frontend-builder /app/frontend/dist /app/backend/frontend/dist

WORKDIR /app/backend

VOLUME /app/backend/database

EXPOSE 3000

CMD ["npm", "run", "dev"]