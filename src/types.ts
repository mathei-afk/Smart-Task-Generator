export interface Task {
  id: string;
  title: string;
  description: string;
  steps: string[];
  estimatedTime: string;
  priority: 'High' | 'Medium' | 'Low';
  completed?: boolean;
}