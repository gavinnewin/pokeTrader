#!/bin/bash

# Configuration
AWS_REGION="us-east-2"  # Updated to match your configuration
AWS_ACCOUNT_ID="114513627015"       # Replace with your AWS account ID
ECR_FRONTEND_REPO="poketrader-frontend"
ECR_BACKEND_REPO="poketrader-backend"
ECS_CLUSTER_NAME="poketrader-cluster"
ECS_FRONTEND_SERVICE="poketrader-frontend-service"
ECS_BACKEND_SERVICE="poketrader-backend-service"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Verify AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

print_status "Starting deployment process..."

# Get AWS Account ID if not provided
if [ -z "$AWS_ACCOUNT_ID" ]; then
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    print_status "Detected AWS Account ID: $AWS_ACCOUNT_ID"
fi

# Create ECR repositories if they don't exist
print_status "Creating ECR repositories..."
aws ecr describe-repositories --repository-names $ECR_FRONTEND_REPO --region $AWS_REGION 2>/dev/null || \
    aws ecr create-repository --repository-name $ECR_FRONTEND_REPO --region $AWS_REGION

aws ecr describe-repositories --repository-names $ECR_BACKEND_REPO --region $AWS_REGION 2>/dev/null || \
    aws ecr create-repository --repository-name $ECR_BACKEND_REPO --region $AWS_REGION

# Get ECR login token
print_status "Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build and push frontend image
print_status "Building frontend Docker image..."
docker build -f Dockerfile.frontend -t $ECR_FRONTEND_REPO:latest .
docker tag $ECR_FRONTEND_REPO:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO:latest

print_status "Pushing frontend image to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO:latest

# Build and push backend image
print_status "Building backend Docker image..."
docker build -f Dockerfile.backend -t $ECR_BACKEND_REPO:latest .
docker tag $ECR_BACKEND_REPO:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO:latest

print_status "Pushing backend image to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO:latest

# Update task definitions with actual values
print_status "Updating task definitions..."
sed -i "s/YOUR_ACCOUNT_ID/$AWS_ACCOUNT_ID/g" aws/task-definition-frontend.json
sed -i "s/YOUR_REGION/$AWS_REGION/g" aws/task-definition-frontend.json
sed -i "s/YOUR_ACCOUNT_ID/$AWS_ACCOUNT_ID/g" aws/task-definition-backend.json
sed -i "s/YOUR_REGION/$AWS_REGION/g" aws/task-definition-backend.json

# Register task definitions
print_status "Registering ECS task definitions..."
aws ecs register-task-definition --cli-input-json file://aws/task-definition-frontend.json --region $AWS_REGION
aws ecs register-task-definition --cli-input-json file://aws/task-definition-backend.json --region $AWS_REGION

# Create ECS cluster if it doesn't exist
print_status "Creating ECS cluster..."
aws ecs describe-clusters --clusters $ECS_CLUSTER_NAME --region $AWS_REGION 2>/dev/null || \
    aws ecs create-cluster --cluster-name $ECS_CLUSTER_NAME --capacity-providers FARGATE --region $AWS_REGION

print_status "Deployment completed successfully!"
print_warning "Next steps:"
print_warning "1. Create secrets in AWS Secrets Manager for your environment variables"
print_warning "2. Update the task definitions with your actual secret ARNs"
print_warning "3. Create ECS services using the AWS Console or CLI"
print_warning "4. Set up an Application Load Balancer for your services" 