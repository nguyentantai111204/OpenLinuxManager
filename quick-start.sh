#!/bin/bash

# OpenLinuxManager Quick Start Script
# This script automates the setup process for new users.

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== OpenLinuxManager Quick Start ===${NC}"

# 1. Check for .env file
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    cp .env.example .env
    
    # Generate a random secure password for DB
    RANDOM_PWD=$(openssl rand -base64 12)
    sed -i "s/random_secure_password/$RANDOM_PWD/g" .env
    echo -e "${GREEN}Generated a random secure database password in .env${NC}"
fi

# 2. Check for Docker
if ! [ -x "$(command -v docker)" ]; then
    echo -e "${YELLOW}Error: Docker is not installed. Please install Docker and try again.${NC}"
    exit 1
fi

if ! [ -x "$(command -v docker-compose)" ] && ! docker compose version >/dev/null 2>&1; then
    echo -e "${YELLOW}Error: Docker Compose is not installed. Please install it and try again.${NC}"
    exit 1
fi

# 3. Start Docker containers
echo -e "${YELLOW}Building and starting containers...${NC}"
if docker compose version >/dev/null 2>&1; then
    docker compose up -d --build
else
    docker-compose up -d --build
fi

echo -e ""
echo -e "${GREEN}✔ Setup complete!${NC}"
echo -e "You can now access the application at: ${YELLOW}http://localhost:3000${NC}"
echo -e "To see logs, run: ${YELLOW}docker compose logs -f${NC}"
