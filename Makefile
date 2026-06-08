.PHONY: run build test migrate-up migrate-down seed docker-up docker-down clean

# Go binary
BINARY_NAME=tdaskills-api
BACKEND_DIR=backend

# Run the server in development mode
run:
	cd $(BACKEND_DIR) && go run cmd/server/main.go

# Build the binary
build:
	cd $(BACKEND_DIR) && go build -o ../bin/$(BINARY_NAME) cmd/server/main.go

# Run tests
test:
	cd $(BACKEND_DIR) && go test ./... -v

# Run migrations up
migrate-up:
	cd $(BACKEND_DIR) && go run cmd/server/main.go -migrate=up

# Run migrations down
migrate-down:
	cd $(BACKEND_DIR) && go run cmd/server/main.go -migrate=down

# Seed the database
seed:
	cd $(BACKEND_DIR) && go run cmd/server/main.go -seed

# Start Docker containers
docker-up:
	docker-compose up -d

# Stop Docker containers
docker-down:
	docker-compose down

# Clean build artifacts
clean:
	rm -rf bin/

# Tidy go modules
tidy:
	cd $(BACKEND_DIR) && go mod tidy

# Full setup: start docker, migrate, seed
setup: docker-up
	@echo "Waiting for database to be ready..."
	@sleep 5
	$(MAKE) migrate-up
	$(MAKE) seed
	@echo "Setup complete! Run 'make run' to start the server."
