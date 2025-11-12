import { useState } from 'react';
import { Subtask, Task } from '../App';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

interface AddSubtaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSubtask: (subtask: Subtask) => void;
  tasks: Task[];
}

export function AddSubtaskDialog({ 
  open, 
  onOpenChange, 
  onAddSubtask,
  tasks 
}: AddSubtaskDialogProps) {
  const [title, setTitle] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [effort, setEffort] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !taskTitle) return;

    const task = tasks.find(t => t.title === taskTitle);
    if (!task) return;

    const newSubtask: Subtask = {
      id: `${task.id}-${Date.now()}`,
      title: title.trim(),
      completed: false,
      taskTitle,
      scheduledTime,
      effort,
    };

    onAddSubtask(newSubtask);
    
    // Reset form
    setTitle('');
    setTaskTitle('');
    setScheduledTime('09:00');
    setEffort('medium');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Scheduled Task</DialogTitle>
          <DialogDescription>
            Schedule a task with time and effort level.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="subtask-title">Task Title</Label>
            <Input
              id="subtask-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent-task">Parent Task</Label>
            <Select value={taskTitle} onValueChange={setTaskTitle}>
              <SelectTrigger id="parent-task">
                <SelectValue placeholder="Select a parent task..." />
              </SelectTrigger>
              <SelectContent>
                {tasks.map(task => (
                  <SelectItem key={task.id} value={task.title}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduled-time">Scheduled Time</Label>
            <Input
              id="scheduled-time"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="effort-level">Effort Level</Label>
            <Select value={effort} onValueChange={(value: any) => setEffort(value)}>
              <SelectTrigger id="effort-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
