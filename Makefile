.PHONY: install test build deploy

# Install dependencies
install:
	npm install
	cd client && npm install

# Run tests
test:
	npm test
	cd client && npm test

# Build the application
build:
	cd client && npm run build

# Run the application
dev:
	npm run dev

# Clean up
clean:
	rm -rf node_modules
	rm -rf client/node_modules
	rm -rf client/dist

# Deploy (example for production build)
deploy: install test build
	npm run start

# Run specific test suites
test-backend:
	npm test

test-frontend:
	cd client && npm test

# Generate test coverage reports
coverage:
	npm run test:coverage
	cd client && npm run test:coverage

# Lint the code
lint:
	cd client && npm run lint

# Default target
all: install test build 