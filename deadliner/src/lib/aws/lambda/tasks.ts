import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createTask, getUserTasks, deleteTask } from '../dynamodb';

export const createTaskHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing request body' }),
      };
    }

    const { taskName, deadline, userEmail, userId } = JSON.parse(event.body);

    if (!taskName || !deadline || !userEmail || !userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const task = await createTask({
      taskName,
      deadline,
      userEmail,
      userId,
    });

    return {
      statusCode: 201,
      body: JSON.stringify(task),
    };
  } catch (error) {
    console.error('Error creating task:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const getTasksHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.queryStringParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing userId parameter' }),
      };
    }

    const tasks = await getUserTasks(userId);

    return {
      statusCode: 200,
      body: JSON.stringify(tasks),
    };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const deleteTaskHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.queryStringParameters?.userId;
    const taskId = event.queryStringParameters?.taskId;

    if (!userId || !taskId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    await deleteTask(userId, taskId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Task deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting task:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}; 