# AWS ECS Deployment Guide for PokeTrader

This guide will help you deploy your PokeTrader application to AWS using Docker containers and ECS (Elastic Container Service).

## Prerequisites

1. **AWS CLI installed and configured**
   ```bash
   aws configure
   ```

2. **Docker Desktop running**

3. **Required AWS IAM permissions**:
   - EC2 Full Access
   - ECS Full Access
   - ECR Full Access
   - VPC Full Access
   - Application Load Balancer Full Access
   - Secrets Manager Full Access

## File Structure

Your project now includes these new files for AWS deployment:

```
pokeTrader/
├── Dockerfile.frontend          # Frontend container definition
├── Dockerfile.backend           # Backend container definition
├── nginx.conf                   # Nginx configuration for frontend
├── docker-compose.yml           # For local testing
├── .dockerignore               # Files to exclude from Docker builds
├── aws/
│   ├── task-definition-frontend.json
│   └── task-definition-backend.json
├── scripts/
│   ├── deploy-to-aws.sh        # Main deployment script
│   └── setup-aws-infrastructure.sh
└── backend/
    └── healthcheck.js          # Health check for backend container
```

## Step-by-Step Deployment

### Step 1: Test Locally (Optional)

```bash
# Test your containers locally
docker-compose up --build
```

Visit http://localhost:3000 to test your application.

### Step 2: Set Up AWS Infrastructure

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Set up VPC, ALB, security groups, etc.
./scripts/setup-aws-infrastructure.sh
```

This script creates:
- VPC with public/private subnets
- Internet Gateway and NAT Gateway
- Application Load Balancer
- Security Groups
- Target Groups

### Step 3: Configure Environment Variables

Create your environment variables in AWS Secrets Manager:

```bash
# MongoDB connection string
aws secretsmanager create-secret \
    --name "poketrader/mongo-uri" \
    --description "MongoDB connection string" \
    --secret-string "your-mongodb-connection-string"

# JWT Secret
aws secretsmanager create-secret \
    --name "poketrader/jwt-secret" \
    --description "JWT secret key" \
    --secret-string "your-jwt-secret"

# Cloudinary credentials
aws secretsmanager create-secret \
    --name "poketrader/cloudinary-cloud-name" \
    --secret-string "your-cloudinary-cloud-name"

aws secretsmanager create-secret \
    --name "poketrader/cloudinary-api-key" \
    --secret-string "your-cloudinary-api-key"

aws secretsmanager create-secret \
    --name "poketrader/cloudinary-api-secret" \
    --secret-string "your-cloudinary-api-secret"
```

### Step 4: Update Configuration

1. **Edit `scripts/deploy-to-aws.sh`**:
   - Set your preferred AWS region
   - Optionally set your AWS Account ID (script can auto-detect)

2. **Update task definitions** with your actual secret ARNs:
   - Edit `aws/task-definition-backend.json`
   - Replace placeholder ARNs with your actual secret ARNs

### Step 5: Deploy to AWS

```bash
# Deploy containers to ECR and ECS
./scripts/deploy-to-aws.sh
```

This script will:
1. Create ECR repositories
2. Build and push Docker images
3. Register ECS task definitions
4. Create ECS cluster

### Step 6: Create ECS Services

After the deployment script completes, create the ECS services:

```bash
# Load the saved configuration
source aws-config.txt

# Create frontend service
aws ecs create-service \
    --cluster poketrader-cluster \
    --service-name poketrader-frontend-service \
    --task-definition poketrader-frontend \
    --desired-count 2 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$PRIVATE_SUBNET_1_ID,$PRIVATE_SUBNET_2_ID],securityGroups=[$ECS_SG_ID]}" \
    --load-balancers targetGroupArn=$FRONTEND_TG_ARN,containerName=poketrader-frontend,containerPort=80

# Create backend service
aws ecs create-service \
    --cluster poketrader-cluster \
    --service-name poketrader-backend-service \
    --task-definition poketrader-backend \
    --desired-count 2 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$PRIVATE_SUBNET_1_ID,$PRIVATE_SUBNET_2_ID],securityGroups=[$ECS_SG_ID]}" \
    --load-balancers targetGroupArn=$BACKEND_TG_ARN,containerName=poketrader-backend,containerPort=5000
```

### Step 7: Get Your Application URL

```bash
# Get the load balancer DNS name
aws elbv2 describe-load-balancers \
    --load-balancer-arns $ALB_ARN \
    --query 'LoadBalancers[0].DNSName' \
    --output text
```

Your application will be available at: `http://[ALB-DNS-NAME]`

## Architecture Overview

```
Internet → ALB → ECS Services → ECR Images
              ↓
          Target Groups
              ↓
    Frontend (React/Nginx) + Backend (Express.js)
              ↓
          MongoDB Atlas
```

## Monitoring and Logs

### View ECS Service Status
```bash
aws ecs describe-services \
    --cluster poketrader-cluster \
    --services poketrader-frontend-service poketrader-backend-service
```

### View CloudWatch Logs
- Frontend logs: `/ecs/poketrader-frontend`
- Backend logs: `/ecs/poketrader-backend`

## Updating Your Application

1. **Update your code**
2. **Rebuild and push images**:
   ```bash
   ./scripts/deploy-to-aws.sh
   ```
3. **Update ECS services**:
   ```bash
   aws ecs update-service \
       --cluster poketrader-cluster \
       --service poketrader-frontend-service \
       --force-new-deployment
   
   aws ecs update-service \
       --cluster poketrader-cluster \
       --service poketrader-backend-service \
       --force-new-deployment
   ```

## Scaling

### Auto Scaling
You can set up auto scaling based on CPU/memory usage:

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
    --service-namespace ecs \
    --scalable-dimension ecs:service:DesiredCount \
    --resource-id service/poketrader-cluster/poketrader-frontend-service \
    --min-capacity 1 \
    --max-capacity 10
```

### Manual Scaling
```bash
aws ecs update-service \
    --cluster poketrader-cluster \
    --service poketrader-frontend-service \
    --desired-count 4
```

## Cost Optimization

1. **Use Fargate Spot** for non-critical workloads
2. **Set up CloudWatch alarms** for cost monitoring
3. **Use appropriate resource allocation** (CPU/Memory)
4. **Consider scheduled scaling** for predictable traffic patterns

## Security Best Practices

1. **Enable VPC Flow Logs**
2. **Use AWS WAF** with your ALB
3. **Enable ALB access logs**
4. **Rotate secrets regularly**
5. **Use least privilege IAM policies**

## Troubleshooting

### Common Issues

1. **Task fails to start**:
   - Check CloudWatch logs
   - Verify environment variables
   - Check health check endpoints

2. **502 Bad Gateway**:
   - Verify target group health
   - Check security group rules
   - Verify backend is running on correct port

3. **Unable to pull image**:
   - Check ECR repository permissions
   - Verify task execution role

### Useful Commands

```bash
# View task logs
aws logs get-log-events \
    --log-group-name "/ecs/poketrader-backend" \
    --log-stream-name "ecs/poketrader-backend/[TASK-ID]"

# Check task definition
aws ecs describe-task-definition \
    --task-definition poketrader-backend

# View running tasks
aws ecs list-tasks \
    --cluster poketrader-cluster \
    --service-name poketrader-backend-service
```

## Cleanup

To remove all AWS resources:

```bash
# Delete ECS services
aws ecs update-service --cluster poketrader-cluster --service poketrader-frontend-service --desired-count 0
aws ecs update-service --cluster poketrader-cluster --service poketrader-backend-service --desired-count 0
aws ecs delete-service --cluster poketrader-cluster --service poketrader-frontend-service
aws ecs delete-service --cluster poketrader-cluster --service poketrader-backend-service

# Delete cluster
aws ecs delete-cluster --cluster poketrader-cluster

# Delete load balancer, target groups, VPC, etc.
# (Detailed cleanup commands can be added as needed)
```

## Support

For issues specific to your application:
1. Check CloudWatch logs
2. Verify environment variables in Secrets Manager
3. Test containers locally first
4. Ensure MongoDB Atlas allows connections from AWS

---

**Note**: Replace placeholder values (YOUR_ACCOUNT_ID, YOUR_REGION, etc.) with your actual AWS account details before running the scripts. 