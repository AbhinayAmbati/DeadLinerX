import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const docClient = DynamoDBDocumentClient.from(client);

export const TASKS_TABLE = process.env.DYNAMODB_TASKS_TABLE || 'Tasks';

export interface Task {
  userId: string;
  userEmail: string;
  taskName: string;
  deadline: string;
  reminderSent: boolean;
  createdAt: string;
  taskId: string; // New field for unique task identification
}

export async function createTask(task: Omit<Task, 'taskId' | 'createdAt' | 'reminderSent'>): Promise<Task> {
  const taskId = Date.now().toString(); // Simple ID generation
  const now = new Date().toISOString();
  
  const newTask: Task = {
    ...task,
    taskId,
    createdAt: now,
    reminderSent: false,
  };

  await docClient.send(
    new PutCommand({
      TableName: TASKS_TABLE,
      Item: newTask,
    })
  );

  return newTask;
}

export async function getUserTasks(userId: string): Promise<Task[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TASKS_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ScanIndexForward: true, // true for ascending order by sort key
    })
  );

  return (result.Items || []) as Task[];
}

export async function deleteTask(userId: string, taskId: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: TASKS_TABLE,
      Key: {
        userId,
        taskId,
      },
    })
  );
} 