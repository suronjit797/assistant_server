# Use the official Bun image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lock
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Expose the application port
EXPOSE 5000

# Start the development server
CMD ["bun", "run", "dev"]
