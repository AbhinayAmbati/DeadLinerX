import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTasks, deleteTask } from '@/lib/api/tasks';
import { useTokens } from '@/hooks/useTokens';
import { Task } from '@/lib/aws/dynamodb';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface IdTokenClaims {
  email: string;
  sub: string;
  [key: string]: unknown;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, idToken } = useTokens();

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated || !idToken) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      const claims = idToken as unknown as IdTokenClaims;
      console.log('Fetching tasks for user:', {
        userId: claims.sub,
        isAuthenticated,
        claims,
      });

      const data = await getTasks(claims.sub);
      
      // Validate that data is an array
      if (!Array.isArray(data)) {
        console.error('Invalid tasks data received:', data);
        throw new Error('Received invalid data from the API');
      }

      // Type check each task
      const validTasks = data.filter((task): task is Task => {
        const isValid = task &&
          typeof task === 'object' &&
          'taskId' in task &&
          'taskName' in task &&
          'deadline' in task;
        
        if (!isValid) {
          console.warn('Invalid task data:', task);
        }
        
        return isValid;
      });

      console.log('Processed tasks:', {
        rawData: data,
        validTasks,
        tasksCount: validTasks.length
      });

      setTasks(validTasks);
      setError(null);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error instanceof Error ? error.message : 'Failed to load tasks');
      setTasks([]); // Reset tasks on error
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, idToken]);

  useEffect(() => {
    if (isAuthenticated && idToken) {
      fetchTasks();
    } else {
      setTasks([]); // Reset tasks when user is not authenticated
      setIsLoading(false);
    }
  }, [isAuthenticated, idToken, fetchTasks]);

  const handleDelete = async (taskId: string) => {
    if (!isAuthenticated || !idToken) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const claims = idToken as unknown as IdTokenClaims;
      await deleteTask(claims.sub, taskId);
      toast.success('Task deleted successfully');
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to delete task. Please try again.'
      );
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center">
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchTasks}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center">
            <p className="text-gray-500">No tasks found. Add your first task above!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.taskId}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{task.taskName}</h3>
                  <p className="text-sm text-gray-500">
                    Due: {new Date(task.deadline).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(task.taskId)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 