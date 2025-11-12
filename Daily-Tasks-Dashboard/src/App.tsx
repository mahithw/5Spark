import { useState } from 'react';
import { UpcomingTasks } from './components/UpcomingTasks';
import { DailySchedule } from './components/DailySchedule';
import { RightSidebar } from './components/RightSidebar';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  taskTitle: string;
  scheduledTime: string;
  effort: 'low' | 'medium' | 'high';
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string; // ISO date string
  subtasks: Subtask[];
  isStandaloneTask?: boolean; // If true, this task appears in the schedule timeline
  scheduledTime?: string; // Time for standalone tasks
  effort?: 'low' | 'medium' | 'high'; // Effort for standalone tasks
  repeatPattern?: 'daily' | 'weekly' | 'monthly' | 'none'; // Repeat pattern
}

export type UserMood = 'happy' | 'neutral' | 'sad';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review project proposal',
    completed: false,
    priority: 'high',
    dueDate: '2025-11-09',
    subtasks: [
      { id: '1-1', title: 'Read executive summary', completed: false, taskTitle: 'Review project proposal', scheduledTime: '09:00', effort: 'low' },
      { id: '1-2', title: 'Review budget breakdown', completed: false, taskTitle: 'Review project proposal', scheduledTime: '09:30', effort: 'high' },
      { id: '1-3', title: 'Check timeline milestones', completed: false, taskTitle: 'Review project proposal', scheduledTime: '10:00', effort: 'medium' },
      { id: '1-4', title: 'Provide feedback', completed: false, taskTitle: 'Review project proposal', scheduledTime: '10:30', effort: 'medium' },
    ],
  },
  {
    id: '2',
    title: 'Team meeting preparation',
    completed: false,
    priority: 'medium',
    dueDate: '2025-11-09',
    subtasks: [
      { id: '2-1', title: 'Prepare agenda', completed: false, taskTitle: 'Team meeting preparation', scheduledTime: '08:00', effort: 'low' },
      { id: '2-2', title: 'Collect team updates', completed: false, taskTitle: 'Team meeting preparation', scheduledTime: '08:30', effort: 'medium' },
      { id: '2-3', title: 'Book conference room', completed: false, taskTitle: 'Team meeting preparation', scheduledTime: '11:00', effort: 'low' },
    ],
  },
  {
    id: '3',
    title: 'Update documentation',
    completed: false,
    priority: 'low',
    dueDate: '2025-11-12',
    subtasks: [
      { id: '3-1', title: 'Review current docs', completed: false, taskTitle: 'Update documentation', scheduledTime: '13:00', effort: 'low' },
      { id: '3-2', title: 'Add new API endpoints', completed: false, taskTitle: 'Update documentation', scheduledTime: '14:00', effort: 'high' },
      { id: '3-3', title: 'Update examples', completed: false, taskTitle: 'Update documentation', scheduledTime: '15:00', effort: 'high' },
      { id: '3-4', title: 'Publish changes', completed: false, taskTitle: 'Update documentation', scheduledTime: '16:00', effort: 'low' },
    ],
  },
  {
    id: '5',
    title: 'Client presentation',
    completed: false,
    priority: 'high',
    dueDate: '2025-11-10',
    subtasks: [
      { id: '5-1', title: 'Create slide deck', completed: false, taskTitle: 'Client presentation', scheduledTime: '16:30', effort: 'high' },
      { id: '5-2', title: 'Prepare demo environment', completed: false, taskTitle: 'Client presentation', scheduledTime: '17:00', effort: 'medium' },
      { id: '5-3', title: 'Rehearse presentation', completed: false, taskTitle: 'Client presentation', scheduledTime: '17:30', effort: 'medium' },
    ],
  },
  {
    id: '6',
    title: 'Email responses',
    completed: false,
    priority: 'low',
    dueDate: '2025-11-09',
    subtasks: [
      { id: '6-1', title: 'Reply to client emails', completed: false, taskTitle: 'Email responses', scheduledTime: '14:30', effort: 'low' },
    ],
  },
  {
    id: '7',
    title: 'Weekly report',
    completed: false,
    priority: 'medium',
    dueDate: '2025-11-15',
    subtasks: [
      { id: '7-1', title: 'Gather metrics', completed: false, taskTitle: 'Weekly report', scheduledTime: '15:30', effort: 'medium' },
      { id: '7-2', title: 'Write summary', completed: false, taskTitle: 'Weekly report', scheduledTime: '16:00', effort: 'medium' },
    ],
  },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const [userMood, setUserMood] = useState<UserMood>('neutral');

  const handleTaskToggle = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newCompletedState = !task.completed;
          // When completing a task, complete all its subtasks
          // When uncompleting a task, uncomplete all its subtasks
          return {
            ...task,
            completed: newCompletedState,
            subtasks: task.subtasks.map(subtask => ({
              ...subtask,
              completed: newCompletedState
            }))
          };
        }
        return task;
      })
    );
  };

  const handleSubtaskToggle = (subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        // Check if this is a standalone task being toggled
        if (subtaskId === `standalone-${task.id}`) {
          return {
            ...task,
            completed: !task.completed
          };
        }
        
        const updatedSubtasks = task.subtasks.map((subtask) =>
          subtask.id === subtaskId
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        );
        
        // Check if all subtasks are completed
        const allSubtasksCompleted = updatedSubtasks.length > 0 && 
          updatedSubtasks.every(st => st.completed);
        
        // Auto-complete task if all subtasks are completed
        return {
          ...task,
          subtasks: updatedSubtasks,
          completed: allSubtasksCompleted
        };
      })
    );
  };

  const handleAddTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const handleAddSubtask = (subtask: Subtask) => {
    setTasks((prev) =>
      prev.map((task) => {
        // Find the task this subtask belongs to based on taskTitle
        if (task.title === subtask.taskTitle) {
          return {
            ...task,
            subtasks: [...task.subtasks, subtask],
          };
        }
        return task;
      })
    );
  };

  // Sort tasks to put completed ones at the bottom
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  // Get all subtasks, sorted to put completed ones at the bottom
  // Also include standalone tasks as subtasks
  const allSubtasks = tasks.flatMap((task) => {
    const regularSubtasks = task.subtasks;
    
    // If it's a standalone task, add it as a subtask
    if (task.isStandaloneTask && task.scheduledTime && task.effort) {
      const standaloneSubtask: Subtask = {
        id: `standalone-${task.id}`,
        title: task.title,
        completed: task.completed,
        taskTitle: task.title,
        scheduledTime: task.scheduledTime,
        effort: task.effort,
      };
      return [...regularSubtasks, standaloneSubtask];
    }
    
    return regularSubtasks;
  }).sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <UpcomingTasks
        tasks={sortedTasks}
        onTaskToggle={handleTaskToggle}
        onTaskHover={setHoveredTaskId}
        onAddTask={handleAddTask}
        userMood={userMood}
      />
      <DailySchedule
        subtasks={allSubtasks}
        onSubtaskToggle={handleSubtaskToggle}
        hoveredTaskId={hoveredTaskId}
        onAddSubtask={handleAddSubtask}
        tasks={sortedTasks}
      />
      <RightSidebar onMoodChange={setUserMood} currentMood={userMood} />
    </div>
  );
}