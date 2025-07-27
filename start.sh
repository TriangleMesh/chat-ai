#!/bin/bash

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🚀 Starting Chat AI Application...${NC}"
echo

# Check dependencies
echo -e "${BLUE}📦 Checking dependencies...${NC}"

if [ ! -d "server/node_modules" ]; then
    echo -e "${RED}❌ Backend dependencies not installed, please run: cd server && npm install${NC}"
    exit 1
fi

if [ ! -d "client/node_modules" ]; then
    echo -e "${RED}❌ Frontend dependencies not installed, please run: cd client && npm install${NC}"
    exit 1
fi

if [ ! -f "server/.env" ]; then
    echo -e "${RED}❌ Missing server/.env file, please configure environment variables first${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies check passed${NC}"
echo

# Start backend
echo -e "${BLUE}🔧 Starting backend server...${NC}"
cd server
npm run dev &
SERVER_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo -e "${BLUE}🎨 Starting frontend application...${NC}"
cd client
npm run dev &
CLIENT_PID=$!
cd ..

echo
echo -e "${GREEN}🎉 Application started successfully!${NC}"
echo -e "${CYAN}📱 Frontend: http://localhost:5173${NC}"
echo -e "${CYAN}🔧 Backend: http://localhost:3000${NC}"
echo
echo -e "${YELLOW}💡 Press Ctrl+C to stop all services${NC}"

# Graceful shutdown
trap 'echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"; kill $SERVER_PID $CLIENT_PID 2>/dev/null; echo -e "${GREEN}👋 Goodbye!${NC}"; exit 0' INT

# Wait for processes
wait