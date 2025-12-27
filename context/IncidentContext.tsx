import React, { createContext, useContext, useState, useEffect } from 'react';
import { Incident, IncidentContextType, IncidentType, IncidentStatus, Severity } from '../types';

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

const MOCK_INCIDENTS: Incident[] = [
  {
    id: '1',
    type: IncidentType.FIRE,
    description: 'Large structural fire reported at warehouse district. Visible smoke.',
    location: { lat: 40.7128, lng: -74.0060, address: '123 Industrial Ave' },
    severity: Severity.CRITICAL,
    status: IncidentStatus.VERIFIED,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    upvotes: 42,
    upvotedBy: [], // In a real app, this would contain IDs
    notes: [{ id: 'n1', author: 'Dispatcher', content: 'Units dispatched.', timestamp: new Date().toISOString() }]
  },
  {
    id: '2',
    type: IncidentType.MEDICAL,
    description: 'Car accident, two vehicles involved. Possible injuries.',
    location: { lat: 40.7150, lng: -74.0100, address: 'Intersection of Main & 5th' },
    severity: Severity.HIGH,
    status: IncidentStatus.UNVERIFIED,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    upvotes: 12,
    upvotedBy: [],
    notes: []
  },
  {
    id: '3',
    type: IncidentType.HAZARD,
    description: 'Downed power line blocking the road.',
    location: { lat: 40.7200, lng: -73.9900, address: '450 Park Lane' },
    severity: Severity.MEDIUM,
    status: IncidentStatus.RESOLVED,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    upvotes: 5,
    upvotedBy: [],
    notes: []
  }
];

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);

  const addIncident = (data: Omit<Incident, 'id' | 'timestamp' | 'upvotes' | 'upvotedBy' | 'notes' | 'status'>) => {
    const newIncident: Incident = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      upvotes: 0,
      upvotedBy: [],
      status: IncidentStatus.UNVERIFIED,
      notes: []
    };
    setIncidents(prev => [newIncident, ...prev]);
  };

  const updateStatus = (id: string, status: IncidentStatus) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
  };

  const addNote = (id: string, content: string) => {
    const newNote = {
      id: Math.random().toString(36).substr(2, 9),
      author: 'Admin', // In a real app, this would be the logged-in user
      content,
      timestamp: new Date().toISOString()
    };
    setIncidents(prev => prev.map(inc => 
      inc.id === id ? { ...inc, notes: [...inc.notes, newNote] } : inc
    ));
  };

  const upvoteIncident = (id: string, userId: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        // Check if user already upvoted
        if (inc.upvotedBy.includes(userId)) {
          return inc; // No change
        }
        return {
          ...inc,
          upvotes: inc.upvotes + 1,
          upvotedBy: [...inc.upvotedBy, userId]
        };
      }
      return inc;
    }));
  };

  return (
    <IncidentContext.Provider value={{ incidents, addIncident, updateStatus, addNote, upvoteIncident }}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidents = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
};