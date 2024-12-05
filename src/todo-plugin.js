import { TodoStorage } from './storage.js';
import { TodoUI } from './ui.js';
import { styles } from './styles.js';

export class TodoPlugin {
  constructor() {
    this.initialize();
  }
  
  async initialize() {
    try {
      // Add styles
      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
      
      // Create container
      const container = document.createElement('div');
      container.className = 'todo-plugin-container';
      document.body.appendChild(container);
      
      // Create toggle button
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'todo-plugin-toggle';
      toggleBtn.innerHTML = '<img src="/src/images/todo.svg" alt="Todo" width="36" height="36">';
      document.body.appendChild(toggleBtn);
      
      // Initialize storage and UI
      const storage = new TodoStorage(null);
      const ui = new TodoUI(container, storage);
      await ui.initialize();
      
      // Setup toggle functionality
      toggleBtn.addEventListener('click', () => {
        ui.toggle();
      });
      
    } catch (error) {
      console.error('Failed to initialize todo plugin:', error);
      // Clean up any partial initialization
      document.querySelectorAll('.todo-plugin-container, .todo-plugin-toggle').forEach(el => el.remove());
    }
  }
}

// Make it available globally
window.TodoPlugin = TodoPlugin;