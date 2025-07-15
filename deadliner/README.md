# Deadliner

A task management application built with Next.js and AWS services.

## AWS Setup

### DynamoDB Table

1. Create a DynamoDB table with the following configuration:
   - Table Name: `Tasks`
   - Partition Key: `userId` (String)
   - Sort Key: `taskId` (String)
   - Enable TTL: No
   - Capacity mode: On-demand

### Lambda Functions

Create three Lambda functions for handling tasks:

1. `create-task`:
   - Runtime: Node.js 18.x
   - Handler: `tasks.createTaskHandler`
   - Source: `src/lib/aws/lambda/tasks.ts`

2. `get-tasks`:
   - Runtime: Node.js 18.x
   - Handler: `tasks.getTasksHandler`
   - Source: `src/lib/aws/lambda/tasks.ts`

3. `delete-task`:
   - Runtime: Node.js 18.x
   - Handler: `tasks.deleteTaskHandler`
   - Source: `src/lib/aws/lambda/tasks.ts`

Add the following environment variables to each Lambda function:
- `DYNAMODB_TASKS_TABLE`: The name of your DynamoDB table

### API Gateway

1. Create a new REST API
2. Create the following endpoints:
   - POST /tasks -> create-task Lambda
   - GET /tasks -> get-tasks Lambda
   - DELETE /tasks -> delete-task Lambda
3. Enable CORS for all endpoints
4. Deploy the API to a stage (e.g., 'prod')

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# AWS Configuration
NEXT_PUBLIC_API_GATEWAY_URL=your-api-gateway-url
AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
DYNAMODB_TASKS_TABLE=Tasks
```

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Security Considerations

1. Use AWS IAM roles and policies to restrict Lambda function permissions
2. Store AWS credentials securely
3. Implement proper authentication and authorization
4. Use environment variables for sensitive configuration
5. Enable AWS CloudWatch for monitoring and logging
