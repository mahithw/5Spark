import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/tasks'); // Adjust the API endpoint as needed
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = (title: string) => {
    const newTask = { id: Date.now(), title, completed: false };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return { tasks, loading, addTask, toggleTaskCompletion };
};

export default useTasks;