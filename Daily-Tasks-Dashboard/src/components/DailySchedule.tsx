import { useState } from 'react';
import { Subtask, Task } from '../App';
import { Checkbox } from './ui/checkbox';
import { Clock, Calendar, Plus } from 'lucide-react';
import { Badge } from './ui/badge';
import { AddSubtaskDialog } from './AddSubtaskDialog';

interface DailyScheduleProps {
  subtasks: Subtask[];
  onSubtaskToggle: (subtaskId: string) => void;
  hoveredTaskId: string | null;
  onAddSubtask: (subtask: Subtask) => void;
  tasks: Task[];
}

export function DailySchedule({ 
  subtasks, 
  onSubtaskToggle, 
  hoveredTaskId,
  onAddSubtask,
  tasks
}: DailyScheduleProps) {
  const [showAddSubtask, setShowAddSubtask] = useState(false);

  // Helper function to check if a subtask belongs to the hovered task
  const getTaskIdFromSubtask = (subtask: Subtask) => {
    return subtask.id.split('-')[0];
  };

  const isHighlighted = (subtask: Subtask) => {
    if (!hoveredTaskId) return false;
    return getTaskIdFromSubtask(subtask) === hoveredTaskId;
  };

  // Sort subtasks by scheduled time, but prioritize highlighted ones
  const sortedSubtasks = [...subtasks].sort((a, b) => {
    const aHighlighted = isHighlighted(a);
    const bHighlighted = isHighlighted(b);
    
    // Separate completed vs incomplete
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // Put completed at the bottom
    }
    
    // If hovering, prioritize highlighted subtasks
    if (hoveredTaskId) {
      if (aHighlighted && !bHighlighted) return -1;
      if (!aHighlighted && bHighlighted) return 1;
    }
    
    // Otherwise sort by time
    return a.scheduledTime.localeCompare(b.scheduledTime);
  });

  // Group by time period
  const groupedByPeriod = sortedSubtasks.reduce((acc, subtask) => {
    const hour = parseInt(subtask.scheduledTime.split(':')[0]);
    let period: string;
    
    if (hour < 12) {
      period = 'Morning (8:00 AM - 12:00 PM)';
    } else if (hour < 17) {
      period = 'Afternoon (12:00 PM - 5:00 PM)';
    } else {
      period = 'Evening (5:00 PM - 8:00 PM)';
    }
    
    if (!acc[period]) {
      acc[period] = [];
    }
    acc[period].push(subtask);
    return acc;
  }, {} as Record<string, Subtask[]>);

  const completedCount = subtasks.filter((st) => st.completed).length;
  const totalCount = subtasks.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

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

  return (
    <>
      <div className="flex-1 bg-gray-50 p-4 flex flex-col h-full overflow-hidden">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-6 h-6 text-purple-500" />
              <h1 className="text-gray-900">Today's Schedule</h1>
            </div>
            <p className="text-gray-500">
              {completedCount} of {totalCount} tasks completed ({Math.round(progressPercentage)}%)
            </p>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {Object.entries(groupedByPeriod).map(([period, periodSubtasks]) => (
                <div key={period}>
                  <h2 className="text-gray-700 mb-3">{period}</h2>
                  <div className="space-y-2">
                    {periodSubtasks.map((subtask) => {
                      const highlighted = isHighlighted(subtask);
                      return (
                        <div
                          key={subtask.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 ${
                            highlighted
                              ? 'bg-blue-50 border-blue-300 shadow-lg scale-[1.02] ring-2 ring-blue-200 opacity-100'
                              : hoveredTaskId
                              ? 'border-gray-200 opacity-30 bg-white'
                              : 'border-gray-200 hover:bg-gray-50 opacity-100 bg-white'
                          }`}
                        >
                          <Checkbox
                            checked={subtask.completed}
                            onCheckedChange={() => onSubtaskToggle(subtask.id)}
                            id={`subtask-${subtask.id}`}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <label
                              htmlFor={`subtask-${subtask.id}`}
                              className={`block cursor-pointer ${
                                subtask.completed ? 'line-through text-gray-400' : 'text-gray-900'
                              }`}
                            >
                              {subtask.title}
                            </label>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge 
                                variant="outline" 
                                className={`${
                                  highlighted ? 'bg-blue-100 border-blue-300 text-blue-700' : 'text-gray-600'
                                }`}
                              >
                                {subtask.taskTitle}
                              </Badge>
                              <Badge variant="outline" className={getEffortColor(subtask.effort)}>
                                {subtask.effort}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 shrink-0">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(subtask.scheduledTime)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {totalCount === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No tasks scheduled for today. Add some tasks to get started!
                </div>
              )}
            </div>
          </div>

          <div className="p-3 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={() => setShowAddSubtask(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Scheduled Task
            </button>
          </div>

          {completedCount === totalCount && totalCount > 0 && (
            <div className="mx-4 mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-green-800">
                🎉 All tasks completed for today! Excellent work!
              </p>
            </div>
          )}
        </div>
      </div>

      <AddSubtaskDialog
        open={showAddSubtask}
        onOpenChange={setShowAddSubtask}
        onAddSubtask={onAddSubtask}
        tasks={tasks}
      />
    </>
  );
}