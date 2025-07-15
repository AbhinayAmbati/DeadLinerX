import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createTask, getUserTasks, deleteTask } from '../dynamodb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const createResponse = (statusCode: number, body: unknown): APIGatewayProxyResult => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body),
});

export const createTaskHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Handle OPTIONS request for CORS
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, {});
    }

    if (!event.body) {
      return createResponse(400, { error: 'Missing request body' });
    }

    const { taskName, deadline, userEmail, userId } = JSON.parse(event.body);

    if (!taskName || !deadline || !userEmail || !userId) {
      return createResponse(400, { error: 'Missing required fields' });
    }

    const task = await createTask({
      taskName,
      deadline,
      userEmail,
      userId,
    });

    return createResponse(201, task);
  } catch (error) {
    console.error('Error creating task:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};

export const getTasksHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Handle OPTIONS request for CORS
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, {});
    }

    const userId = event.queryStringParameters?.userId;

    if (!userId) {
      return createResponse(400, { error: 'Missing userId parameter' });
    }

    const tasks = await getUserTasks(userId);

    return createResponse(200, tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};

export const deleteTaskHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Handle OPTIONS request for CORS
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, {});
    }

    const userId = event.queryStringParameters?.userId;
    const taskId = event.queryStringParameters?.taskId;

    if (!userId || !taskId) {
      return createResponse(400, { error: 'Missing required parameters' });
    }

    await deleteTask(userId, taskId);

    return createResponse(200, { message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
}; 