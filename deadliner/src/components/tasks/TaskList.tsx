import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Task {
  _id: string;
  taskName: string;
  deadline: string;
  createdAt: string;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (tasks.length === 0) {
    return <div>No tasks found. Add your first task above!</div>;
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
              key={task._id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium">{task.taskName}</h3>
              <p className="text-sm text-gray-500">
                Due: {new Date(task.deadline).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 