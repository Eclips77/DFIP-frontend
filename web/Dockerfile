# Stage 1: Builder
# This stage installs dependencies and builds the Next.js application.
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
# Using --frozen-lockfile is best practice for CI/CD to ensure exact dependency versions
RUN npm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the Next.js application for production
RUN npm run build

# Stage 2: Production
# This stage creates the final, smaller image with only the built app.
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the built application from the builder stage
# This includes the .next folder, public folder, and package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose the port that Next.js runs on
EXPOSE 3000

# The command to run the production server
CMD ["npm", "start"]
