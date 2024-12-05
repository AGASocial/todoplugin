export const styles = `
.todo-plugin-container {
  position: fixed;
  top: 33vh;
  right: 20px;
  width: 360px;
  background: #ffffff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  padding: 24px;
  z-index: 10000;
  display: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  animation: slideIn 0.3s ease-out;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-sizing: border-box;
}

.todo-plugin-container *,
.todo-plugin-container *::before,
.todo-plugin-container *::after {
  box-sizing: border-box;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.todo-plugin-toggle {
  position: fixed;
  top: 33vh;
  right: 0px;
  width: 48px;
  height: 48px;
  background: #ffffff;
  border: none;
  border-radius: 5%;
  color: white;
  font-size: 24px;
  cursor: pointer;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.todo-plugin-toggle:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

.todo-header {
  margin-bottom: 24px;
  width: 100%;
}

.todo-title-container {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
  position: relative;
}

.todo-title-container h2 {
  margin: 0;
  color: #1a1a1a;
  font-size: 24px;
  font-weight: 600;
}

.todo-buttons-container {
  display: flex;
  gap: 12px;
  position: absolute;
  left: 120px;
  top: 50%;
  transform: translateY(-50%);
}

.icon-button {
  background: #ffffff;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 36px;
  height: 36px;
  border-radius: 8px;
}

.icon-button img {
  width: 30px;
  height: 30px;
  display: block;
}

.icon-button:hover {
  background: #eeeeee;
  transform: translateY(-1px);
}

.todo-header input[type="text"] {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  margin-top: 8px;
  font-size: 15px;
  transition: all 0.2s ease;
  background: #f8f8f8;
  max-width: 100%;
}

.todo-header input[type="text"]:focus {
  border-color: #4CAF50;
  background: #ffffff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.todo-list {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 4px;
  width: 100%;
}

.todo-list::-webkit-scrollbar {
  width: 6px;
}

.todo-list::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.todo-list::-webkit-scrollbar-thumb {
  background: #dadada;
  border-radius: 3px;
}

.todo-item {
  display: grid;
  grid-template-columns: 24px 1fr auto auto;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #f8f8f8;
  transition: all 0.2s ease;
  width: 100%;
}

.todo-item:hover {
  background: #f2f2f2;
}

.todo-item input[type="checkbox"] {
  margin: 0;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid #4CAF50;
  cursor: pointer;
  position: relative;
  appearance: none;
  background: white;
  transition: all 0.2s ease;
}

.todo-item input[type="checkbox"]:checked {
  background: #4CAF50;
}

.todo-item input[type="checkbox"]:checked::after {
  content: '✓';
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
}

.todo-text {
  color: #333;
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
  overflow-wrap: break-word;
}

.todo-action-button {
  padding: 6px;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.todo-action-button img {
  width: 25px;
  height: 25px;
  display: block;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.todo-action-button:hover {
  background: rgba(0, 0, 0, 0.05);
}

.todo-action-button:hover img {
  opacity: 1;
}

.todo-item a {
  color: #2196F3;
  text-decoration: none;
  transition: color 0.2s ease;
  word-break: break-word;
}

.todo-item a:hover {
  color: #1976D2;
  text-decoration: underline;
}

.todo-password-form {
  padding: 24px;
  color: #333;
  text-align: center;
  width: 100%;
}

.todo-password-form h2 {
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #1a1a1a;
}

.todo-password-form p {
  margin: 0 0 24px 0;
  color: #666;
  font-size: 15px;
  line-height: 1.6;
}

.todo-password-input {
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s ease;
  background: #f8f8f8;
}

.todo-password-input:focus {
  border-color: #4CAF50;
  background: #ffffff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.todo-submit-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin-top: 8px;
  transition: all 0.2s ease;
}

.todo-submit-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.todo-error {
  color: #f44336;
  margin: 12px 0;
  font-size: 14px;
  display: none;
  padding: 8px 12px;
  background: #ffebee;
  border-radius: 6px;
}

.todo-edit-form {
  display: flex;
  gap: 8px;
  align-items: center;
  flex: 1;
  width: 100%;
}

.todo-edit-input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: all 0.2s ease;
  min-width: 0;
}

.todo-edit-input:focus {
  border-color: #4CAF50;
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.todo-edit-button {
  padding: 6px;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.todo-edit-button.save {
  color: #4CAF50;
}

.todo-edit-button.save:hover {
  background: rgba(76, 175, 80, 0.1);
}

.todo-edit-button.cancel {
  color: #f44336;
}

.todo-edit-button.cancel:hover {
  background: rgba(244, 67, 54, 0.1);
}

@media (max-width: 480px) {
  .todo-plugin-container {
    width: calc(100% - 40px);
    right: 20px;
    left: 20px;
  }
  
  .todo-title-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .todo-buttons-container {
    position: static;
    transform: none;
    width: 100%;
    justify-content: flex-start;
  }
}
`;