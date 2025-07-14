import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  taskName: { type: String, required: true },
  deadline: { type: Date, required: true },
  reminderSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Create indexes for efficient querying
taskSchema.index({ userId: 1, deadline: 1 });
taskSchema.index({ deadline: 1, reminderSent: 1 });

export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export type TaskDocument = mongoose.Document & {
  userId: string;
  userEmail: string;
  taskName: string;
  deadline: Date;
  reminderSent: boolean;
  createdAt: Date;
}; 