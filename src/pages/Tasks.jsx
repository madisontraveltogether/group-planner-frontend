import React, { useState, useEffect } from 'react';
import API from '../services/api'; // Axios instance for API calls

const Tasks = ({ eventId }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [editingTask, setEditingTask] = useState(null); // Task being edited
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await API.get(`/events/${eventId}/tasks`);
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    fetchTasks();
  }, [eventId]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post(`/events/${eventId}/tasks`, newTask);
      setTasks([...tasks, data]); // Add new task to the list
      setNewTask({ title: '', description: '', dueDate: '' }); // Reset form
    } catch (err) {
      setError('Failed to add task. Please try again.');
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put(`/events/${eventId}/tasks/${editingTask._id}`, editingTask);
      setTasks(tasks.map((task) => (task._id === data._id ? data : task))); // Update task in the list
      setEditingTask(null); // Close edit mode
    } catch (err) {
      setError('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/events/${eventId}/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId)); // Remove task from the list
    } catch (err) {
      setError('Failed to delete task. Please try again.');
    }
  };

  return (
    <div className="tasks">
      <h3>Tasks</h3>
      {error && <p className="error">{error}</p>}

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          required
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Task List */}
      {tasks.length > 0 ? (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              {editingTask && editingTask._id === task._id ? (
                /* Edit Task Form */
                <form onSubmit={handleEditTask}>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    required
                  />
                  <textarea
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    required
                  />
                  <input
                    type="date"
                    value={editingTask.dueDate}
                    onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingTask(null)}>
                    Cancel
                  </button>
                </form>
              ) : (
                /* Display Task */
                <>
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                  <p>Status: {task.status}</p>
                  <button onClick={() => setEditingTask(task)}>Edit</button>
                  <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks found. Add a new task to get started!</p>
      )}
    </div>
  );
};

export default Tasks;
