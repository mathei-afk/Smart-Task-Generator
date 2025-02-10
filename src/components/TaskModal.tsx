import React from 'react';
import { X, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../types';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onToggleComplete: (taskId: string) => void;
}

export function TaskModal({ task, onClose, onToggleComplete }: TaskModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => onToggleComplete(task.id)}
              className="text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              {task.completed ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
            <h2 className={`text-2xl font-bold text-gray-900 ${
              task.completed ? 'line-through text-gray-500' : ''
            }`}>
              {task.title}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className={`inline-block px-2 py-1 rounded text-sm ${
              task.priority === 'High' ? 'bg-red-100 text-red-800' :
              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {task.priority} Priority
            </span>
            <span className="text-gray-600">{task.estimatedTime}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className={`text-gray-700 ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.description}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Steps</h3>
          <ol className="list-decimal pl-5">
            {task.steps.map((step, index) => (
              <li key={index} className={`text-gray-700 mb-2 ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}