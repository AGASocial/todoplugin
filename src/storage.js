import { CryptoUtils } from './crypto.js';

export class TodoStorage {
  constructor(password) {
    this.password = password;
    this.storageKey = 'todo-list-data';
  }
  
  async save(todos) {
    try {
      if (!this.password) {
        throw new Error('Password not set');
      }
      const encrypted = await CryptoUtils.encrypt(JSON.stringify(todos), this.password);
      localStorage.setItem(this.storageKey, JSON.stringify(encrypted));
    } catch (error) {
      console.error('Failed to save todos:', error);
      throw new Error('Failed to save todos');
    }
  }
  
  async load() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      if (!this.password) {
        throw new Error('Password not set');
      }
      
      const encrypted = JSON.parse(data);
      const decrypted = await CryptoUtils.decrypt(encrypted, this.password);
      const parsed = JSON.parse(decrypted);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to load todos:', error);
      localStorage.removeItem(this.storageKey); // Clear corrupted data
      return [];
    }
  }
  
  exportData() {
    const data = localStorage.getItem(this.storageKey);
    return data || '{"salt":[],"iv":[],"data":[]}';
  }
  
  async importData(data, password) {
    try {
      if (!password) {
        throw new Error('Password required for import');
      }
      
      const encrypted = JSON.parse(data);
      if (!encrypted.salt || !encrypted.iv || !encrypted.data) {
        throw new Error('Invalid data format');
      }
      
      const decrypted = await CryptoUtils.decrypt(encrypted, password);
      const parsed = JSON.parse(decrypted);
      if (!Array.isArray(parsed)) {
        throw new Error('Invalid todo list format');
      }
      
      localStorage.setItem(this.storageKey, data);
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}