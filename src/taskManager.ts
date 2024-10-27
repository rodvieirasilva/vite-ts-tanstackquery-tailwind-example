import { QueryClient, QueryCache } from '@tanstack/query-core';
import { fetchTasks, createTask, toggleTask } from './api';
import { Task } from './types';

export const queryClient = new QueryClient({
  queryCache: new QueryCache(),
});

export const TASKS_QUERY_KEY = ['tasks'];

export function setupTaskManager(
  listElement: HTMLUListElement,
  inputElement: HTMLInputElement,
  addButton: HTMLButtonElement
) {
  const renderTasks = (tasks: Task[]) => {
    listElement.innerHTML = tasks
      .map(
        (task) => `
        <li class="flex items-center gap-4 p-4 bg-gray-800 rounded-lg mb-2">
          <input type="checkbox" 
            ${task.completed ? 'checked' : ''} 
            class="w-5 h-5 rounded"
            data-task-id="${task.id}"
          >
          <span class="${task.completed ? 'line-through text-gray-500' : 'text-white'}">
            ${task.title}
          </span>
        </li>
      `
      )
      .join('');

    // Add event listeners to checkboxes
    listElement.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener('change', async () => {
        const taskId = Number(checkbox.getAttribute('data-task-id'));
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
          await toggleTask(task);
          await queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
        }
      });
    });
  };

  // Initial tasks fetch
  const fetchAndRenderTasks = async () => {
    const query = queryClient.getQueryData(TASKS_QUERY_KEY);
    if (!query) {
      const tasks = await queryClient.fetchQuery({
        queryKey: TASKS_QUERY_KEY,
        queryFn: fetchTasks,
      });
      renderTasks(tasks);
    }
  };

  // Add task handler
  addButton.addEventListener('click', async () => {
    const title = inputElement.value.trim();
    if (title) {
      await createTask(title);
      inputElement.value = '';
      await queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      const tasks = await queryClient.fetchQuery({
        queryKey: TASKS_QUERY_KEY,
        queryFn: fetchTasks,
      });
      renderTasks(tasks);
    }
  });

  // Subscribe to query cache changes
  queryClient.getQueryCache().subscribe(() => {
    const tasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);
    if (tasks) {
      renderTasks(tasks);
    }
  });

  return { fetchAndRenderTasks };
}