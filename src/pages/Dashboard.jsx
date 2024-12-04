import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api'; // Import your API instance

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('/events');
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCreateEvent = () => {
    navigate('/create-event'); // Navigate to the event creation page
  };

  return (
    <div className="dashboard">
      <h2>My Events</h2>
      <button onClick={handleCreateEvent}>Create New Event</button>
      {loading ? (
        <p>Loading...</p>
      ) : events.length > 0 ? (
        <div className="event-list">
          {events.map((event) => (
            <div
              key={event._id}
              className="event-card"
              onClick={() => navigate(`/events/${event._id}`)}
            >
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>
                {new Date(event.startDate).toLocaleDateString()} -{' '}
                {new Date(event.endDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No events found. Click "Create New Event" to add one!</p>
      )}
    </div>
  );
};

export default Dashboard;
