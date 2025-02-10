import React, { useState } from 'react';
import { ListTodo, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { generateTasks } from './lib/gemini';
import { TaskModal } from './components/TaskModal';
import { Task } from './types';

function App() {
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const result = await generateTasks(input);
      const tasksWithCompletion = result.tasks.map((task: Task) => ({
        ...task,
        completed: false
      }));
      setTasks(tasksWithCompletion);
      setInput('');
    } catch (error) {
      console.error('Failed to generate tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal when clicking the checkbox
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center mb-8">
          <ListTodo className="w-8 h-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">Smart Task Generator</h1>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Descrie ce vrei să faci..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generează...
                </>
              ) : (
                'Generează Taskuri'
              )}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 ${
                task.completed ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <button
                    onClick={(e) => toggleTaskCompletion(task.id, e)}
                    className="mr-3 text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  <div 
                    onClick={() => setSelectedTask(task)}
                    className="flex-1 cursor-pointer"
                  >
                    <h3 className={`text-lg font-semibold text-gray-900 ${
                      task.completed ? 'line-through text-gray-500' : ''
                    }`}>
                      {task.title}
                    </h3>
                    <p className={`text-gray-600 mt-2 line-clamp-2 ${
                      task.completed ? 'line-through text-gray-400' : ''
                    }`}>
                      {task.description}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-sm ml-4 ${
                  task.priority === 'High' ? 'bg-red-100 text-red-800' :
                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedTask && (
          <TaskModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onToggleComplete={(taskId) => toggleTaskCompletion(taskId, new MouseEvent('click') as any)}
          />
        )}
      </div>
    </div>
  );
}

export default App