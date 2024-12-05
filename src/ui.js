import { TodoStorage } from './storage.js';

export class TodoUI {
  constructor(container, storage) {
    this.container = container;
    this.storage = storage;
    this.todos = [];
    this.isVisible = false;
    this.isAuthenticated = false;
    this.editingId = null;
  }
  
  async initialize() {
    if (this.isAuthenticated) {
      this.todos = await this.storage.load();
    }
    this.render();
  }
  
  createPasswordForm() {
    const form = document.createElement('div');
    form.className = 'todo-password-form';
    
    const title = document.createElement('h2');
    title.textContent = 'Enter Password';
    
    const description = document.createElement('p');
    description.textContent = 'Please enter a password to encrypt your todos.';
    
    const input = document.createElement('input');
    input.type = 'password';
    input.placeholder = 'Enter password';
    input.className = 'todo-password-input';
    
    const confirmInput = document.createElement('input');
    confirmInput.type = 'password';
    confirmInput.placeholder = 'Confirm password';
    confirmInput.className = 'todo-password-input';
    confirmInput.style.display = localStorage.getItem('todo-plugin-auth') ? 'none' : 'block';
    
    const error = document.createElement('p');
    error.className = 'todo-error';
    error.style.display = 'none';
    
    const button = document.createElement('button');
    button.textContent = localStorage.getItem('todo-plugin-auth') ? 'Unlock' : 'Set Password';
    button.className = 'todo-submit-button';
    
    const validateAndSubmit = async () => {
      if (!input.value) {
        error.textContent = 'Password is required';
        error.style.display = 'block';
        return;
      }
      
      if (!localStorage.getItem('todo-plugin-auth')) {
        if (input.value !== confirmInput.value) {
          error.textContent = 'Passwords do not match';
          error.style.display = 'block';
          return;
        }
        
        if (input.value.length < 8) {
          error.textContent = 'Password must be at least 8 characters long';
          error.style.display = 'block';
          return;
        }
      }
      
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(input.value);
        const hash = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        const storedHash = localStorage.getItem('todo-plugin-auth');
        if (storedHash && hashHex !== storedHash) {
          error.textContent = 'Incorrect password';
          error.style.display = 'block';
          input.value = '';
          input.focus();
          return;
        }
        
        if (!storedHash) {
          localStorage.setItem('todo-plugin-auth', hashHex);
        }
        
        this.storage.password = input.value;
        this.isAuthenticated = true;
        await this.initialize();
      } catch (e) {
        error.textContent = 'Authentication error. Please try again.';
        error.style.display = 'block';
        console.error('Auth error:', e);
      }
    };
    
    button.addEventListener('click', validateAndSubmit);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        validateAndSubmit();
      }
    });
    confirmInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        validateAndSubmit();
      }
    });
    
    form.appendChild(title);
    form.appendChild(description);
    form.appendChild(input);
    form.appendChild(confirmInput);
    form.appendChild(error);
    form.appendChild(button);
    
    return form;
  }
  
  createTodoItem(todo) {
    const item = document.createElement('div');
    item.className = 'todo-item';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
    
    if (this.editingId === todo.id) {
      const editForm = document.createElement('div');
      editForm.className = 'todo-edit-form';
      
      const input = document.createElement('input');
      input.type = 'text';
      input.value = todo.text;
      input.className = 'todo-edit-input';
      
      const saveBtn = document.createElement('button');
      saveBtn.textContent = '✓';
      saveBtn.className = 'todo-edit-button save';
      saveBtn.title = 'Save';
      
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = '×';
      cancelBtn.className = 'todo-edit-button cancel';
      cancelBtn.title = 'Cancel';
      
      const saveEdit = async () => {
        if (input.value.trim()) {
          todo.text = input.value.trim();
          await this.storage.save(this.todos);
          this.editingId = null;
          this.render();
        }
      };
      
      const cancelEdit = () => {
        this.editingId = null;
        this.render();
      };
      
      saveBtn.addEventListener('click', saveEdit);
      cancelBtn.addEventListener('click', cancelEdit);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          saveEdit();
        } else if (e.key === 'Escape') {
          cancelEdit();
        }
      });
      
      editForm.appendChild(input);
      editForm.appendChild(saveBtn);
      editForm.appendChild(cancelBtn);
      
      item.appendChild(checkbox);
      item.appendChild(editForm);
    } else {
      const text = document.createElement('span');
      text.className = 'todo-text';
      text.innerHTML = this.linkify(todo.text);
      if (todo.completed) text.style.textDecoration = 'line-through';
      
      const editBtn = document.createElement('button');
      editBtn.className = 'todo-action-button';
      editBtn.innerHTML = `<img src="/src/images/edit.svg" alt="Edit" width="16" height="16">`;
      editBtn.title = 'Edit';
      editBtn.addEventListener('click', () => {
        this.editingId = todo.id;
        this.render();
      });
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'todo-action-button';
      deleteBtn.innerHTML = `<img src="/src/images/delete.svg" alt="Delete" width="16" height="16">`;
      deleteBtn.title = 'Delete';
      deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
      
      item.appendChild(checkbox);
      item.appendChild(text);
      item.appendChild(editBtn);
      item.appendChild(deleteBtn);
    }
    
    return item;
  }
  
  linkify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url => `<a href="${url}" target="_blank">${url}</a>`);
  }
  
  async addTodo(text) {
    this.todos.push({
      id: Date.now(),
      text,
      completed: false
    });
    await this.storage.save(this.todos);
    this.render();
  }
  
  async toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      await this.storage.save(this.todos);
      this.render();
    }
  }
  
  async deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    await this.storage.save(this.todos);
    this.render();
  }
  
  render() {
    this.container.innerHTML = '';
    
    if (!this.isAuthenticated) {
      this.container.appendChild(this.createPasswordForm());
      return;
    }
    
    const header = document.createElement('div');
    header.className = 'todo-header';
    
    const titleContainer = document.createElement('div');
    titleContainer.className = 'todo-title-container';
    
    const title = document.createElement('h2');
    title.textContent = 'Todo List';
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'todo-buttons-container';
    
    const exportBtn = document.createElement('button');
    exportBtn.className = 'icon-button';
    exportBtn.innerHTML = `<img src="/src/images/download.svg" alt="Export" width="20" height="20">`;
    exportBtn.title = 'Export Todos';
    exportBtn.addEventListener('click', () => {
      const data = this.storage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'todos.json';
      a.click();
      URL.revokeObjectURL(url);
    });
    
    const importBtn = document.createElement('button');
    importBtn.className = 'icon-button';
    importBtn.innerHTML = `<img src="/src/images/upload.svg" alt="Import" width="20" height="20">`;
    importBtn.title = 'Import Todos';
    importBtn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        const text = await file.text();
        if (await this.storage.importData(text, this.storage.password)) {
          this.initialize();
        } else {
          alert('Import failed. Invalid file format.');
        }
      });
      input.click();
    });
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Add new todo...';
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        this.addTodo(input.value.trim());
        input.value = '';
      }
    });
    
    buttonsContainer.appendChild(exportBtn);
    buttonsContainer.appendChild(importBtn);
    titleContainer.appendChild(title);
    titleContainer.appendChild(buttonsContainer);
    
    header.appendChild(titleContainer);
    header.appendChild(input);
    
    const list = document.createElement('div');
    list.className = 'todo-list';
    this.todos.forEach(todo => {
      list.appendChild(this.createTodoItem(todo));
    });
    
    this.container.appendChild(header);
    this.container.appendChild(list);
  }
  
  toggle() {
    this.isVisible = !this.isVisible;
    this.container.style.display = this.isVisible ? 'block' : 'none';
  }
}