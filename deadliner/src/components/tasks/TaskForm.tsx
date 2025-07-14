import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const taskSchema = z.object({
  taskName: z.string().min(1, 'Task name is required'),
  deadline: z.string().min(1, 'Deadline is required'),
});

type TaskFormData = z.infer<typeof taskSchema>;

export function TaskForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      toast.success('Task created successfully!');
      reset();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="taskName" className="block text-sm font-medium mb-1">
              Task Name
            </label>
            <input
              {...register('taskName')}
              type="text"
              id="taskName"
              className="w-full p-2 border rounded-md"
              placeholder="Enter task name"
            />
            {errors.taskName && (
              <p className="text-red-500 text-sm mt-1">{errors.taskName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium mb-1">
              Deadline
            </label>
            <input
              {...register('deadline')}
              type="datetime-local"
              id="deadline"
              className="w-full p-2 border rounded-md"
            />
            {errors.deadline && (
              <p className="text-red-500 text-sm mt-1">{errors.deadline.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 