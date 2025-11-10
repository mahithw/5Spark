import { useState } from 'react';
import { Task, UserMood } from '../App';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Calendar, Plus } from 'lucide-react';
import { MonthCalendar } from './MonthCalendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { AddTaskDialog } from './AddTaskDialog';

interface UpcomingTasksProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onTaskHover: (taskId: string | null) => void;
  onAddTask: (task: Task) => void;
  userMood: UserMood;
}

export function UpcomingTasks({
  tasks,
  onTaskToggle,
  onTaskHover,
  onAddTask,
  userMood,
}: UpcomingTasksProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const calculateTotalEffort = (task: Task) => {
    const effortPoints = { low: 1, medium: 2, high: 3 };
    const total = task.subtasks.reduce((sum, subtask) => sum + effortPoints[subtask.effort], 0);
    
    if (total <= 3) return 'low';
    if (total <= 6) return 'medium';
    return 'high';
  };

  // Smart sorting based on mood, priority, and due date
  const sortTasksByMoodAndPriority = (tasksToSort: Task[]) => {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    
    // Separate completed and incomplete tasks
    const incompleteTasks = tasksToSort.filter(t => !t.completed);
    const completedTasks = tasksToSort.filter(t => t.completed);
    
    // Sort incomplete tasks based on mood
    const sortedIncompleteTasks = [...incompleteTasks].sort((a, b) => {
      const aEffort = calculateTotalEffort(a);
      const bEffort = calculateTotalEffort(b);
      const aEffortWeight = { low: 1, medium: 2, high: 3 }[aEffort];
      const bEffortWeight = { low: 1, medium: 2, high: 3 }[bEffort];
      
      // Parse due dates
      const aDate = new Date(a.dueDate);
      const bDate = new Date(b.dueDate);
      const today = new Date('2025-11-09'); // Current date
      const aDaysUntilDue = Math.ceil((aDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const bDaysUntilDue = Math.ceil((bDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      // If user is sad, prioritize low-effort tasks with high/medium priority
      if (userMood === 'sad') {
        // Prioritize low effort tasks
        if (aEffortWeight !== bEffortWeight) {
          return aEffortWeight - bEffortWeight;
        }
        // Among same effort level, prioritize by priority
        if (a.priority !== b.priority) {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        // Then by due date
        return aDaysUntilDue - bDaysUntilDue;
      }
      
      // If user is happy, prioritize high-priority tasks regardless of effort
      if (userMood === 'happy') {
        // Prioritize by priority first
        if (a.priority !== b.priority) {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        // Then by due date
        if (aDaysUntilDue !== bDaysUntilDue) {
          return aDaysUntilDue - bDaysUntilDue;
        }
        // Then by effort (tackle hard things when happy)
        return bEffortWeight - aEffortWeight;
      }
      
      // Neutral mood - balanced approach
      // Prioritize by due date first
      if (aDaysUntilDue !== bDaysUntilDue) {
        return aDaysUntilDue - bDaysUntilDue;
      }
      // Then by priority
      if (a.priority !== b.priority) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      // Then by effort (prefer medium effort)
      const aEffortPreference = aEffortWeight === 2 ? -1 : aEffortWeight;
      const bEffortPreference = bEffortWeight === 2 ? -1 : bEffortWeight;
      return aEffortPreference - bEffortPreference;
    });
    
    // Return sorted incomplete tasks followed by completed tasks
    return [...sortedIncompleteTasks, ...completedTasks];
  };

  const sortedTasks = sortTasksByMoodAndPriority(tasks);
  
  // Calculate active (incomplete) tasks count
  const activeTasks = tasks.filter(t => !t.completed);

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date('2025-11-09');
    const tomorrow = new Date('2025-11-10');
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    const daysUntil = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil > 0 && daysUntil <= 7) {
      return `In ${daysUntil} days`;
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getMoodMessage = () => {
    switch (userMood) {
      case 'sad':
        return '💙 Taking it easy - showing lighter tasks first';
      case 'happy':
        return '🌟 Great energy - ready for challenges!';
      default:
        return '✨ Balanced schedule for the day';
    }
  };

  return (
    <>
      <div className="w-80 bg-gray-50 p-4 flex flex-col h-full overflow-hidden">
        <div 
          className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-hidden cursor-pointer hover:border-blue-300 transition-colors h-full"
          onClick={() => setShowCalendar(true)}
        >
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white flex-shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-blue-500" />
              <h2 className="text-gray-900">Upcoming Tasks</h2>
            </div>
            <p className="text-gray-500">{activeTasks.length} active tasks</p>
            <p className="text-blue-600 mt-1">{getMoodMessage()}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-2">
              {sortedTasks.map((task) => {
                const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
                const totalSubtasks = task.subtasks.length;
                const totalEffort = calculateTotalEffort(task);

                return (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg border bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                    onMouseEnter={() => onTaskHover(task.id)}
                    onMouseLeave={() => onTaskHover(null)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start gap-2">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => onTaskToggle(task.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className={task.completed ? 'line-through text-gray-400' : 'text-gray-900'}>
                          {task.title}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            P: {task.priority}
                          </Badge>
                          <Badge variant="outline" className={getEffortColor(totalEffort)}>
                            E: {totalEffort}
                          </Badge>
                          <Badge variant="outline" className="text-gray-600">
                            {formatDueDate(task.dueDate)}
                          </Badge>
                        </div>
                        <div className="text-gray-500 mt-1.5">
                          {completedSubtasks}/{totalSubtasks} subtasks
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddTask(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-none w-screen h-screen max-h-screen m-0 p-6 rounded-none">
          <MonthCalendar tasks={tasks} />
        </DialogContent>
      </Dialog>

      <AddTaskDialog
        open={showAddTask}
        onOpenChange={setShowAddTask}
        onAddTask={onAddTask}
      />
    </>
  );
}