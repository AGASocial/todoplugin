export class Auth {
  constructor() {
    this.storageKey = 'todo-plugin-auth';
  }

  async collectPassword() {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'todo-auth-modal';
      
      const content = document.createElement('div');
      content.className = 'todo-auth-content';
      
      const title = document.createElement('h2');
      title.textContent = 'Todo List Authentication';
      
      const description = document.createElement('p');
      description.textContent = 'Please enter a password to encrypt your todos. Remember this password as you\'ll need it to access your todos later.';
      
      const input = document.createElement('input');
      input.type = 'password';
      input.placeholder = 'Enter password';
      input.className = 'todo-auth-input';
      
      const confirmInput = document.createElement('input');
      confirmInput.type = 'password';
      confirmInput.placeholder = 'Confirm password';
      confirmInput.className = 'todo-auth-input';
      
      const button = document.createElement('button');
      button.textContent = 'Set Password';
      button.className = 'todo-auth-button';
      
      const error = document.createElement('p');
      error.className = 'todo-auth-error';
      error.style.display = 'none';
      
      const validateAndSubmit = () => {
        if (!input.value) {
          error.textContent = 'Password is required';
          error.style.display = 'block';
          return;
        }
        
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
        
        document.body.removeChild(modal);
        resolve(input.value);
      };
      
      button.addEventListener('click', validateAndSubmit);
      
      // Handle Enter key
      const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          validateAndSubmit();
        }
      };
      
      input.addEventListener('keypress', handleKeyPress);
      confirmInput.addEventListener('keypress', handleKeyPress);
      
      content.appendChild(title);
      content.appendChild(description);
      content.appendChild(input);
      content.appendChild(confirmInput);
      content.appendChild(error);
      content.appendChild(button);
      modal.appendChild(content);
      
      document.body.appendChild(modal);
      input.focus();
    });
  }

  async getStoredPassword() {
    try {
      const hashedPassword = localStorage.getItem(this.storageKey);
      if (!hashedPassword) {
        const password = await this.collectPassword();
        // Store a hashed version of the password
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        localStorage.setItem(this.storageKey, hashHex);
        return password;
      }
      
      return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'todo-auth-modal';
        
        const content = document.createElement('div');
        content.className = 'todo-auth-content';
        
        const title = document.createElement('h2');
        title.textContent = 'Todo List Authentication';
        
        const input = document.createElement('input');
        input.type = 'password';
        input.placeholder = 'Enter your password';
        input.className = 'todo-auth-input';
        
        const button = document.createElement('button');
        button.textContent = 'Unlock';
        button.className = 'todo-auth-button';
        
        const error = document.createElement('p');
        error.className = 'todo-auth-error';
        error.style.display = 'none';
        
        const validateAndSubmit = async () => {
          try {
            const encoder = new TextEncoder();
            const data = encoder.encode(input.value);
            const hash = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hash));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            if (hashHex === hashedPassword) {
              document.body.removeChild(modal);
              resolve(input.value);
            } else {
              error.textContent = 'Incorrect password';
              error.style.display = 'block';
              input.value = '';
              input.focus();
            }
          } catch (e) {
            error.textContent = 'Authentication error. Please try again.';
            error.style.display = 'block';
            console.error('Auth error:', e);
          }
        };
        
        button.addEventListener('click', validateAndSubmit);
        
        // Handle Enter key
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            validateAndSubmit();
          }
        });
        
        content.appendChild(title);
        content.appendChild(input);
        content.appendChild(error);
        content.appendChild(button);
        modal.appendChild(content);
        
        document.body.appendChild(modal);
        input.focus();
      });
    } catch (error) {
      console.error('Authentication error:', error);
      localStorage.removeItem(this.storageKey); // Clear corrupted auth data
      return this.collectPassword(); // Start fresh
    }
  }
}