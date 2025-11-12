import { useState } from 'react';
import { Task } from '../App';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Task) => void;
}

export function AddTaskDialog({ open, onOpenChange, onAddTask }: AddTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('2025-11-09');
  const [isStandaloneTask, setIsStandaloneTask] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [effort, setEffort] = useState<'low' | 'medium' | 'high'>('medium');
  const [repeatPattern, setRepeatPattern] = useState<'daily' | 'weekly' | 'monthly' | 'none'>('none');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      completed: false,
      priority,
      dueDate,
      subtasks: [],
      isStandaloneTask,
      scheduledTime: isStandaloneTask ? scheduledTime : undefined,
      effort: isStandaloneTask ? effort : undefined,
      repeatPattern: repeatPattern !== 'none' ? repeatPattern : undefined,
    };

    onAddTask(newTask);
    
    // Reset form
    setTitle('');
    setPriority('medium');
    setDueDate('2025-11-09');
    setIsStandaloneTask(false);
    setScheduledTime('09:00');
    setEffort('medium');
    setRepeatPattern('none');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task with priority and due date.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Task Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-priority">Priority</Label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger id="task-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-due-date">Due Date</Label>
            <Input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <Checkbox 
              id="standalone-task" 
              checked={isStandaloneTask}
              onCheckedChange={(checked) => setIsStandaloneTask(checked as boolean)}
            />
            <Label htmlFor="standalone-task" className="cursor-pointer">
              This is a standalone task (will appear in schedule)
            </Label>
          </div>

          {isStandaloneTask && (
            <>
              <div className="space-y-2">
                <Label htmlFor="task-time">Scheduled Time</Label>
                <Input
                  id="task-time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-effort">Effort Level</Label>
                <Select value={effort} onValueChange={(value: any) => setEffort(value)}>
                  <SelectTrigger id="task-effort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="repeat-pattern">Repeat</Label>
            <Select value={repeatPattern} onValueChange={(value: any) => setRepeatPattern(value)}>
              <SelectTrigger id="repeat-pattern">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Does not repeat</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
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