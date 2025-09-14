#!/bin/bash

# Production deployment script for PayloadCMS
set -e

echo "🚀 Starting production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ .env.production file not found!${NC}"
    echo -e "${YELLOW}📝 Please copy .env.production.example to .env.production and update with your production values${NC}"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Docker
if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed or not in PATH${NC}"
    exit 1
fi

# Check Docker Compose
if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi

# Use docker compose or docker-compose based on availability
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

echo -e "${GREEN}✅ Docker and Docker Compose are available${NC}"

# Build and start production services
echo -e "${YELLOW}🔨 Building production images...${NC}"
$DOCKER_COMPOSE -f docker-compose.prod.yml build --no-cache

echo -e "${YELLOW}🗄️  Starting PostgreSQL...${NC}"
$DOCKER_COMPOSE -f docker-compose.prod.yml up -d postgres

echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
sleep 10

echo -e "${YELLOW}🚀 Starting PayloadCMS application...${NC}"
$DOCKER_COMPOSE -f docker-compose.prod.yml up -d payload

echo -e "${GREEN}✅ Production deployment completed!${NC}"
echo -e "${GREEN}🌐 Your application should be available at: http://localhost:8890${NC}"

# Optional: Start Nginx proxy
read -p "Do you want to start the Nginx reverse proxy? (y/N): " start_nginx
if [ "$start_nginx" = "y" ] || [ "$start_nginx" = "Y" ]; then
    echo -e "${YELLOW}🔧 Starting Nginx reverse proxy...${NC}"
    $DOCKER_COMPOSE -f docker-compose.prod.yml --profile with-proxy up -d nginx
    echo -e "${GREEN}✅ Nginx proxy started! Your application is available at: http://localhost${NC}"
fi

echo ""
echo -e "${GREEN}📊 Container status:${NC}"
$DOCKER_COMPOSE -f docker-compose.prod.yml ps

echo ""
echo -e "${YELLOW}📝 Useful commands:${NC}"
echo "  View logs: $DOCKER_COMPOSE -f docker-compose.prod.yml logs -f"
echo "  Stop all: $DOCKER_COMPOSE -f docker-compose.prod.yml down"
echo "  Restart: $DOCKER_COMPOSE -f docker-compose.prod.yml restart"
echo "  Shell access: $DOCKER_COMPOSE -f docker-compose.prod.yml exec payload sh"
