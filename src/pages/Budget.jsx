import React, { useState, useEffect } from 'react';
import API from '../services/api'; // Axios instance for API calls

const Budgets = ({ eventId }) => {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ category: '', plannedAmount: '', actualAmount: '' });
  const [editingBudget, setEditingBudget] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const { data } = await API.get(`/events/${eventId}/budgets`);
        setBudgets(data);
      } catch (err) {
        console.error('Error fetching budgets:', err);
      }
    };

    fetchBudgets();
  }, [eventId]);

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post(`/events/${eventId}/budgets`, newBudget);
      setBudgets([...budgets, data]); // Add the new budget to the list
      setNewBudget({ category: '', plannedAmount: '', actualAmount: '' }); // Reset form
    } catch (err) {
      setError('Failed to add budget item. Please try again.');
    }
  };

  const handleEditBudget = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put(`/events/${eventId}/budgets/${editingBudget._id}`, editingBudget);
      setBudgets(budgets.map((budget) => (budget._id === data._id ? data : budget))); // Update the list
      setEditingBudget(null); // Close edit mode
    } catch (err) {
      setError('Failed to update budget item. Please try again.');
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      await API.delete(`/events/${eventId}/budgets/${budgetId}`);
      setBudgets(budgets.filter((budget) => budget._id !== budgetId)); // Remove the budget from the list
    } catch (err) {
      setError('Failed to delete budget item. Please try again.');
    }
  };

  return (
    <div className="budgets">
      <h3>Budgets</h3>
      {error && <p className="error">{error}</p>}

      {/* Add Budget Form */}
      <form onSubmit={handleAddBudget} className="budget-form">
        <input
          type="text"
          placeholder="Category"
          value={newBudget.category}
          onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Planned Amount"
          value={newBudget.plannedAmount}
          onChange={(e) => setNewBudget({ ...newBudget, plannedAmount: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Actual Amount"
          value={newBudget.actualAmount}
          onChange={(e) => setNewBudget({ ...newBudget, actualAmount: e.target.value })}
        />
        <button type="submit">Add Budget Item</button>
      </form>

      {/* Budget List */}
      {budgets.length > 0 ? (
        <ul className="budget-list">
          {budgets.map((budget) => (
            <li key={budget._id} className="budget-item">
              {editingBudget && editingBudget._id === budget._id ? (
                /* Edit Budget Form */
                <form onSubmit={handleEditBudget}>
                  <input
                    type="text"
                    value={editingBudget.category}
                    onChange={(e) => setEditingBudget({ ...editingBudget, category: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    value={editingBudget.plannedAmount}
                    onChange={(e) => setEditingBudget({ ...editingBudget, plannedAmount: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    value={editingBudget.actualAmount}
                    onChange={(e) => setEditingBudget({ ...editingBudget, actualAmount: e.target.value })}
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingBudget(null)}>
                    Cancel
                  </button>
                </form>
              ) : (
                /* Display Budget */
                <>
                  <p>
                    <strong>{budget.category}</strong>: Planned ${budget.plannedAmount}, Actual $
                    {budget.actualAmount || 'N/A'}
                  </p>
                  <button onClick={() => setEditingBudget(budget)}>Edit</button>
                  <button onClick={() => handleDeleteBudget(budget._id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No budget items found. Add a new item to get started!</p>
      )}
    </div>
  );
};

export default Budgets;
