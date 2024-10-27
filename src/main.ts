import './style.css';
import { setupTaskManager } from './taskManager';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-8">
    <div class="w-full max-w-2xl">
      <h1 class="text-4xl font-bold text-white mb-8">Task Manager</h1>
      
      <div class="flex gap-4 mb-8">
        <input 
          type="text" 
          id="taskInput"
          placeholder="Enter a new task"
          class="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
        >
        <button 
          id="addTask"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Task
        </button>
      </div>

      <ul id="taskList" class="space-y-2"></ul>
    </div>
  </div>
`;

const taskManager = setupTaskManager(
  document.querySelector<HTMLUListElement>('#taskList')!,
  document.querySelector<HTMLInputElement>('#taskInput')!,
  document.querySelector<HTMLButtonElement>('#addTask')!
);

taskManager.fetchAndRenderTasks();