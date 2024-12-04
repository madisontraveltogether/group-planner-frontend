import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api'; // Import the Axios instance
import Tasks from '../components/Tasks'; // Import the new Tasks component
import Budgets from '../components/Budgets';
import Guests from '../components/Guests';


const EventDetails = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [event, setEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks'); // Default tab

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await API.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event details:', err);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <p>Loading event details...</p>;
  }

  return (
    <div className="event-details">
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>
        {new Date(event.startDate).toLocaleDateString()} -{' '}
        {new Date(event.endDate).toLocaleDateString()}
      </p>

      <div className="tabs">
        <button
          onClick={() => setActiveTab('tasks')}
          className={activeTab === 'tasks' ? 'active' : ''}
        >
          Tasks
        </button>
        <button
          onClick={() => setActiveTab('budgets')}
          className={activeTab === 'budgets' ? 'active' : ''}
        >
          Budgets
        </button>
        <button
          onClick={() => setActiveTab('guests')}
          className={activeTab === 'guests' ? 'active' : ''}
        >
          Guests
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'tasks' && <Tasks eventId={id} />}
        {activeTab === 'budgets' && <Budgets eventId={id} />}
        {activeTab === 'guests' && <Guests eventId={id} />}
      </div>
    </div>
  );
};

export default EventDetails;

