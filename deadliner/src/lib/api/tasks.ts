import { Task } from '../aws/dynamodb';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

if (!API_BASE_URL) {
  console.error('NEXT_PUBLIC_API_GATEWAY_URL is not defined');
}

async function handleResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    if (contentType?.includes('application/json')) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    } else {
      const text = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: text,
        url: response.url,
      });
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
  }

  if (!contentType?.includes('application/json')) {
    const text = await response.text();
    console.error('Unexpected response type:', {
      contentType,
      text: text.substring(0, 200), // Show first 200 chars
      status: response.status,
      url: response.url,
    });
    throw new Error('API response was not JSON');
  }

  return response.json();
}

export async function createTask(task: {
  taskName: string;
  deadline: string;
  userId: string;
  userEmail: string;
}): Promise<Task> {
  console.log('Creating task:', {
    url: `${API_BASE_URL}/tasks`,
    task,
  });

  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(task),
  });

  return handleResponse(response);
}

export async function getTasks(userId: string): Promise<Task[]> {
  console.log('Fetching tasks:', {
    url: `${API_BASE_URL}/tasks?userId=${userId}`,
  });

  const response = await fetch(`${API_BASE_URL}/tasks?userId=${userId}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  return handleResponse(response);
}

export async function deleteTask(userId: string, taskId: string): Promise<void> {
  console.log('Deleting task:', {
    url: `${API_BASE_URL}/tasks?userId=${userId}&taskId=${taskId}`,
  });

  const response = await fetch(`${API_BASE_URL}/tasks?userId=${userId}&taskId=${taskId}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  await handleResponse(response);
} 