import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { IncidentStatus, Severity } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CheckCircle, MessageSquare, AlertTriangle, Map, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Dashboard: React.FC = () => {
  const { incidents, updateStatus, addNote } = useIncidents();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');

  const selectedIncident = incidents.find(i => i.id === selectedId);

  // Stats for the chart
  const statsData = [
    { name: 'Fire', count: incidents.filter(i => i.type === 'Fire').length },
    { name: 'Med', count: incidents.filter(i => i.type === 'Medical').length },
    { name: 'Pol', count: incidents.filter(i => i.type === 'Police').length },
    { name: 'Haz', count: incidents.filter(i => i.type === 'Hazard').length },
  ];

  const handleAddNote = () => {
    if (selectedId && noteInput.trim()) {
      addNote(selectedId, noteInput);
      setNoteInput('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
        
        {/* Left Col: List & Stats */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-48">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
              <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Total Active</h3>
              <div className="text-4xl font-bold text-white">{incidents.filter(i => i.status !== 'Resolved').length}</div>
              <div className="text-emerald-500 text-sm mt-1">+4 new this hour</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Incident Distribution</h3>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsData}>
                    <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9'}} cursor={{fill: 'transparent'}} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {statsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
               <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Critical Alerts</h3>
               <div className="flex items-center space-x-2 text-emergency-red">
                 <AlertTriangle className="h-8 w-8" />
                 <span className="text-3xl font-bold">{incidents.filter(i => i.severity === Severity.CRITICAL).length}</span>
               </div>
               <div className="text-slate-500 text-xs mt-2">Requires immediate attention</div>
            </div>
          </div>

          {/* Incident Table */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="font-bold text-lg">Incoming Incidents</h2>
              <Button size="sm" variant="ghost">Export CSV</Button>
            </div>
            <div className="overflow-y-auto flex-1 p-2">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950 text-slate-400 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-medium">Severity</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {incidents.map((inc) => (
                    <tr 
                      key={inc.id} 
                      onClick={() => setSelectedId(inc.id)}
                      className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${selectedId === inc.id ? 'bg-slate-800 border-l-2 border-electric-blue' : ''}`}
                    >
                      <td className="px-4 py-3"><Badge type="severity" value={inc.severity} /></td>
                      <td className="px-4 py-3 text-slate-300">{inc.type}</td>
                      <td className="px-4 py-3 text-slate-300 max-w-xs truncate">{inc.description}</td>
                      <td className="px-4 py-3"><Badge type="status" value={inc.status} /></td>
                      <td className="px-4 py-3 text-slate-500">{new Date(inc.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                      <td className="px-4 py-3">
                         <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><CheckCircle className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Details Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
          {selectedIncident ? (
            <>
              <div className="p-6 border-b border-slate-800 bg-slate-950/30">
                <div className="flex justify-between items-start mb-4">
                  <Badge type="type" value={selectedIncident.type} />
                  <span className="text-xs text-slate-500">{selectedIncident.id}</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{selectedIncident.description}</h2>
                <div className="flex gap-2 mb-4">
                  <Badge type="severity" value={selectedIncident.severity} />
                  <Badge type="status" value={selectedIncident.status} />
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button 
                    size="sm" 
                    variant={selectedIncident.status === IncidentStatus.VERIFIED ? 'primary' : 'outline'}
                    onClick={() => updateStatus(selectedIncident.id, IncidentStatus.VERIFIED)}
                    fullWidth
                  >
                    Verify
                  </Button>
                  <Button 
                     size="sm" 
                     variant={selectedIncident.status === IncidentStatus.RESOLVED ? 'primary' : 'outline'}
                     onClick={() => updateStatus(selectedIncident.id, IncidentStatus.RESOLVED)}
                     className={selectedIncident.status === IncidentStatus.RESOLVED ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                     fullWidth
                  >
                    Resolve
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Location</h3>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                       <p className="text-white text-sm">{selectedIncident.location.address || 'Unknown Address'}</p>
                       <p className="text-slate-500 text-xs mt-1">{selectedIncident.location.lat}, {selectedIncident.location.lng}</p>
                    </div>
                    <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center">
                      <Map className="h-5 w-5 text-electric-blue" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Internal Notes</h3>
                  <div className="space-y-3 mb-4">
                    {selectedIncident.notes.length === 0 ? (
                      <p className="text-slate-600 text-sm italic">No notes added.</p>
                    ) : (
                      selectedIncident.notes.map(note => (
                        <div key={note.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-bold text-blue-400">{note.author}</span>
                            <span className="text-xs text-slate-500">{new Date(note.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm text-slate-300">{note.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Add an update..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                    />
                    <Button size="sm" variant="secondary" onClick={handleAddNote}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <BarChart2 className="h-8 w-8 opacity-50" />
              </div>
              <p className="font-medium">Select an incident to view details and manage response.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
