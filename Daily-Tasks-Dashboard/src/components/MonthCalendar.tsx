import { Task, Subtask } from '../App';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

interface MonthCalendarProps {
  tasks: Task[];
}

type ViewMode = 'month' | 'week' | 'day';

export function MonthCalendar({ tasks }: MonthCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date('2025-11-09'));
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState(new Date('2025-11-09'));

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateStr);
  };

  const getSubtasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const allSubtasks: (Subtask & { taskTitle: string })[] = [];
    
    tasks.forEach(task => {
      task.subtasks.forEach(subtask => {
        allSubtasks.push({ ...subtask, taskTitle: task.title });
      });
    });
    
    return allSubtasks;
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const goToPrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'week') {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 7);
      setSelectedDate(newDate);
    } else {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      setSelectedDate(newDate);
    }
  };

  const goToNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'week') {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 7);
      setSelectedDate(newDate);
    } else {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDate(newDate);
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

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getWeekDays = () => {
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  const handleDateClick = (date: Date) => {
    if (viewMode === 'month') {
      // From month view, go to week view
      setSelectedDate(date);
      setViewMode('week');
    } else if (viewMode === 'week') {
      // From week view, go to day view
      setSelectedDate(date);
      setViewMode('day');
    }
  };

  const handleWeekClick = (date: Date) => {
    setSelectedDate(date);
    setViewMode('week');
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-3">
      {days.map(day => (
        <div key={day} className="text-center text-gray-600 py-3 font-medium">
          {day}
        </div>
      ))}

      {Array.from({ length: startingDayOfWeek }).map((_, index) => (
        <div key={`empty-${index}`} className="min-h-32" />
      ))}

      {Array.from({ length: daysInMonth }).map((_, index) => {
        const day = index + 1;
        const date = new Date(year, month, day);
        const tasksForDay = getTasksForDate(date);
        const isToday = date.toDateString() === new Date('2025-11-09').toDateString();

        return (
          <div
            key={day}
            onClick={() => handleDateClick(date)}
            className={`min-h-32 border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md hover:border-blue-400 ${
              isToday ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 bg-white'
            }`}
          >
            <div className={`mb-2 text-lg ${isToday ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
              {day}
            </div>
            <div className="space-y-1">
              {tasksForDay.slice(0, 3).map(task => (
                <div
                  key={task.id}
                  className={`text-xs p-1.5 rounded truncate ${getPriorityColor(task.priority)}`}
                  title={task.title}
                >
                  {task.title}
                </div>
              ))}
              {tasksForDay.length > 3 && (
                <div className="text-xs text-gray-500 pl-1">
                  +{tasksForDay.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const startDate = weekDays[0];
    const endDate = weekDays[6];
    const weekRange = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    return (
      <div>
        <div className="text-center mb-6 text-gray-600">{weekRange}</div>
        <div className="grid grid-cols-7 gap-3">
          {weekDays.map((date, index) => {
            const tasksForDay = getTasksForDate(date);
            const isToday = date.toDateString() === new Date('2025-11-09').toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();

            return (
              <div key={index}>
                <div className={`text-center py-2 mb-2 rounded-lg ${
                  isToday ? 'bg-blue-500 text-white font-semibold' : 'text-gray-600'
                }`}>
                  <div className="text-sm">{days[date.getDay()]}</div>
                  <div className="text-xl">{date.getDate()}</div>
                </div>
                <div
                  onClick={() => handleDateClick(date)}
                  className={`min-h-96 border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md hover:border-blue-400 ${
                    isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="space-y-2">
                    {tasksForDay.map(task => {
                      const completedSubtasks = task.subtasks.filter(st => st.completed).length;
                      const totalSubtasks = task.subtasks.length;

                      return (
                        <div
                          key={task.id}
                          className={`p-2 rounded border ${getPriorityColor(task.priority)}`}
                        >
                          <div className="font-medium text-sm mb-1">{task.title}</div>
                          <div className="text-xs opacity-80">
                            {completedSubtasks}/{totalSubtasks} subtasks
                          </div>
                          <div className="mt-2 space-y-1">
                            {task.subtasks.slice(0, 2).map(subtask => (
                              <div key={subtask.id} className="text-xs flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(subtask.scheduledTime)}
                              </div>
                            ))}
                            {task.subtasks.length > 2 && (
                              <div className="text-xs opacity-70">+{task.subtasks.length - 2} more</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const tasksForDay = getTasksForDate(selectedDate);
    const dayName = selectedDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });

    // Get all subtasks for this day from all tasks
    const allSubtasksForDay = tasksForDay.flatMap(task => 
      task.subtasks.map(subtask => ({
        ...subtask,
        taskTitle: task.title,
        taskPriority: task.priority
      }))
    ).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

    // Group subtasks by hour
    const groupedByHour: Record<string, typeof allSubtasksForDay> = {};
    allSubtasksForDay.forEach(subtask => {
      const hour = parseInt(subtask.scheduledTime.split(':')[0]);
      const hourKey = `${hour}:00`;
      if (!groupedByHour[hourKey]) {
        groupedByHour[hourKey] = [];
      }
      groupedByHour[hourKey].push(subtask);
    });

    // Generate time slots from 8 AM to 8 PM
    const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8);

    return (
      <div>
        <div className="text-center mb-6">
          <div className="text-2xl font-semibold text-gray-900">{dayName}</div>
          <div className="text-gray-500 mt-1">{tasksForDay.length} tasks scheduled</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline View */}
          <div className="lg:col-span-2 space-y-2">
            <h3 className="font-semibold text-gray-900 mb-4">Timeline</h3>
            {timeSlots.map(hour => {
              const hourKey = `${hour}:00`;
              const subtasksInHour = groupedByHour[hourKey] || [];

              return (
                <div key={hour} className="flex gap-4">
                  <div className="w-24 text-right text-gray-500 pt-2 flex-shrink-0">
                    {formatTime(`${hour}:00`)}
                  </div>
                  <div className="flex-1 border-l-2 border-gray-200 pl-4 pb-4 min-h-16">
                    <div className="space-y-2">
                      {subtasksInHour.map(subtask => (
                        <div
                          key={subtask.id}
                          className="p-3 rounded-lg border bg-white shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{subtask.title}</div>
                              <div className="text-sm text-gray-500 mt-1">{subtask.taskTitle}</div>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline" className={getEffortColor(subtask.effort)}>
                                  {subtask.effort}
                                </Badge>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(subtask.scheduledTime)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tasks Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Tasks Overview</h3>
            <div className="space-y-3">
              {tasksForDay.map(task => {
                const completedSubtasks = task.subtasks.filter(st => st.completed).length;
                const totalSubtasks = task.subtasks.length;

                return (
                  <div
                    key={task.id}
                    className="p-4 rounded-lg border bg-white shadow-sm"
                  >
                    <div className="font-medium text-gray-900 mb-2">{task.title}</div>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        P: {task.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {completedSubtasks}/{totalSubtasks} subtasks completed
                    </div>
                    <div className="mt-3 space-y-1">
                      {task.subtasks.map(subtask => (
                        <div key={subtask.id} className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${
                            subtask.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          <span className={subtask.completed ? 'line-through text-gray-400' : 'text-gray-700'}>
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {tasksForDay.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No tasks scheduled for this day
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Header with View Switcher */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-semibold text-gray-900">
              {viewMode === 'month' && monthName}
              {viewMode === 'week' && 'Week View'}
              {viewMode === 'day' && 'Day View'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Buttons */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleWeekClick(selectedDate)}
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Render Current View */}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}
    </div>
  );
}