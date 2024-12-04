import React, { useState, useEffect } from 'react';
import API from '../services/api'; // Axios instance for API calls

const Guests = ({ eventId }) => {
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState({ name: '', email: '', groupSize: 1, dietaryPreferences: '' });
  const [editingGuest, setEditingGuest] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const { data } = await API.get(`/events/${eventId}/guests`);
        setGuests(data);
      } catch (err) {
        console.error('Error fetching guests:', err);
      }
    };

    fetchGuests();
  }, [eventId]);

  const handleAddGuest = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post(`/events/${eventId}/guests`, newGuest);
      setGuests([...guests, data]); // Add new guest to the list
      setNewGuest({ name: '', email: '', groupSize: 1, dietaryPreferences: '' }); // Reset form
    } catch (err) {
      setError('Failed to add guest. Please try again.');
    }
  };

  const handleEditGuest = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put(`/events/${eventId}/guests/${editingGuest._id}`, editingGuest);
      setGuests(guests.map((guest) => (guest._id === data._id ? data : guest))); // Update the list
      setEditingGuest(null); // Close edit mode
    } catch (err) {
      setError('Failed to update guest. Please try again.');
    }
  };

  const handleDeleteGuest = async (guestId) => {
    try {
      await API.delete(`/events/${eventId}/guests/${guestId}`);
      setGuests(guests.filter((guest) => guest._id !== guestId)); // Remove the guest from the list
    } catch (err) {
      setError('Failed to delete guest. Please try again.');
    }
  };

  return (
    <div className="guests">
      <h3>Guests</h3>
      {error && <p className="error">{error}</p>}

      {/* Add Guest Form */}
      <form onSubmit={handleAddGuest} className="guest-form">
        <input
          type="text"
          placeholder="Name"
          value={newGuest.name}
          onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newGuest.email}
          onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Group Size"
          value={newGuest.groupSize}
          onChange={(e) => setNewGuest({ ...newGuest, groupSize: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Dietary Preferences"
          value={newGuest.dietaryPreferences}
          onChange={(e) => setNewGuest({ ...newGuest, dietaryPreferences: e.target.value })}
        />
        <button type="submit">Add Guest</button>
      </form>

      {/* Guests List */}
      {guests.length > 0 ? (
        <ul className="guest-list">
          {guests.map((guest) => (
            <li key={guest._id} className="guest-item">
              {editingGuest && editingGuest._id === guest._id ? (
                /* Edit Guest Form */
                <form onSubmit={handleEditGuest}>
                  <input
                    type="text"
                    value={editingGuest.name}
                    onChange={(e) => setEditingGuest({ ...editingGuest, name: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    value={editingGuest.email}
                    onChange={(e) => setEditingGuest({ ...editingGuest, email: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    value={editingGuest.groupSize}
                    onChange={(e) => setEditingGuest({ ...editingGuest, groupSize: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    value={editingGuest.dietaryPreferences}
                    onChange={(e) => setEditingGuest({ ...editingGuest, dietaryPreferences: e.target.value })}
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingGuest(null)}>
                    Cancel
                  </button>
                </form>
              ) : (
                /* Display Guest */
                <>
                  <p>
                    <strong>{guest.name}</strong> ({guest.email}) - Group Size: {guest.groupSize}
                  </p>
                  <p>Dietary Preferences: {guest.dietaryPreferences || 'None'}</p>
                  <button onClick={() => setEditingGuest(guest)}>Edit</button>
                  <button onClick={() => handleDeleteGuest(guest._id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No guests found. Add a new guest to get started!</p>
      )}
    </div>
  );
};

export default Guests;
