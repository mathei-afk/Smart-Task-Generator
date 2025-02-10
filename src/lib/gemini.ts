import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyAzreAIehc4azvMoriTEyScvtFktrsrdPY');

export async function generateTasks(input: string): Promise<any> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `You are a task breakdown assistant. Generate a JSON response following this EXACT structure for the task: "${input}".
  The response must be valid JSON and nothing else. No explanations, no markdown, just the JSON object.

  {
    "tasks": [
      {
        "id": "t1",
        "title": "Task title here",
        "description": "Detailed description here",
        "steps": ["Step 1 here", "Step 2 here", "Step 3 here"],
        "estimatedTime": "Time estimate here (e.g., '2 hours')",
        "priority": "High"
      }
    ]
  }

  Rules:
  1. Generate 3-5 tasks
  2. Priority must be exactly "High", "Medium", or "Low"
  3. Each task must have a unique id (t1, t2, t3, etc.)
  4. Each task must have at least 3 steps
  5. Response must be valid JSON`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to find JSON in the response by looking for matching braces
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON object found in response');
    }

    const jsonStr = jsonMatch[0];
    const parsed = JSON.parse(jsonStr);

    // Validate the response structure
    if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
      throw new Error('Invalid response structure: missing tasks array');
    }

    // Validate and clean each task
    parsed.tasks = parsed.tasks.map((task: any, index: number) => ({
      id: task.id || `t${index + 1}`,
      title: task.title || 'Untitled Task',
      description: task.description || 'No description provided',
      steps: Array.isArray(task.steps) ? task.steps : ['Step to be determined'],
      estimatedTime: task.estimatedTime || 'Time to be determined',
      priority: ['High', 'Medium', 'Low'].includes(task.priority) ? task.priority : 'Medium'
    }));

    return parsed;
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    // Return a friendly error task instead of empty array
    return {
      tasks: [{
        id: 'error-1',
        title: 'Could not generate tasks',
        description: 'There was an error generating tasks. Please try again with a different description.',
        steps: ['Try again with a different description', 'Be more specific in your request', 'If the problem persists, try simpler tasks'],
        estimatedTime: 'N/A',
        priority: 'Medium'
      }]
    };
  }
}