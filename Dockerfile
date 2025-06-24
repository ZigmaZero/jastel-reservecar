# Step 1 : Frontend Build
FROM node:22.16.0 AS frontend-builder

# Set the working directory for the frontend build
WORKDIR /app

# Copy the package.json and package-lock.json files for the frontend
COPY ./reservecar-frontend/package.json ./reservecar-frontend/package-lock.json ./frontend/

# Install the frontend dependencies
RUN cd frontend && npm install

# Copy the rest of the frontend source code
COPY ./reservecar-frontend ./frontend/

# Build the frontend application
RUN cd frontend && npm run build

# Step 2 : Backend Build
FROM node:22.16.0 AS backend-builder

# Set the working directory for the backend build
WORKDIR /app

# Copy the package.json and package-lock.json files for the backend
COPY ./reservecar-backend/package.json ./reservecar-backend/package-lock.json ./backend/

# Install the backend dependencies
RUN cd backend && npm install

# Copy the rest of the backend source code
COPY ./reservecar-backend ./backend/

# Copy the built frontend files into the backend directory
COPY --from=frontend-builder /app/frontend/dist /app/backend/frontend/dist

# Change the work directory to the backend
WORKDIR /app/backend

VOLUME /app/backend/database

# Expose the backend port
EXPOSE 3000

CMD ["npm", "run", "dev"]