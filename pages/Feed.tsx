import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidents } from '../context/IncidentContext';
import { useAuth } from '../context/AuthContext';
import { IncidentType, Severity } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MapPin, Clock, ThumbsUp, Filter, Search } from 'lucide-react';

export const Feed: React.FC = () => {
  const navigate = useNavigate();
  const { incidents, upvoteIncident } = useIncidents();
  const { user, isAuthenticated } = useAuth();
  const [filterType, setFilterType] = useState<string>('All');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');

  const filteredIncidents = incidents.filter(inc => {
    const typeMatch = filterType === 'All' || inc.type === filterType;
    const sevMatch = filterSeverity === 'All' || inc.severity === filterSeverity;
    return typeMatch && sevMatch;
  });

  const handleUpvote = (id: string, upvotedBy: string[]) => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    
    if (!upvotedBy.includes(user.id)) {
      upvoteIncident(id, user.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Live Public Feed</h1>
            <p className="text-slate-400">Real-time incident stream from the community.</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
             <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-2">
                <Filter className="h-4 w-4 text-slate-500 mr-2" />
                <select 
                  className="bg-transparent border-none text-sm text-slate-300 focus:ring-0 py-2"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  {Object.values(IncidentType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
             </div>
             <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-2">
                <select 
                  className="bg-transparent border-none text-sm text-slate-300 focus:ring-0 py-2"
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                >
                  <option value="All">All Severities</option>
                  {Object.values(Severity).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIncidents.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No incidents found matching your filters.</p>
            </div>
          ) : (
            filteredIncidents.map((incident) => {
              const hasUpvoted = user && incident.upvotedBy.includes(user.id);
              
              return (
                <div 
                  key={incident.id} 
                  className="group relative bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-all hover:shadow-xl hover:shadow-blue-900/10"
                >
                  {/* Severity Stripe */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    incident.severity === Severity.CRITICAL ? 'bg-emergency-red' :
                    incident.severity === Severity.HIGH ? 'bg-orange-500' :
                    incident.severity === Severity.MEDIUM ? 'bg-yellow-500' : 'bg-slate-500'
                  }`}></div>

                  <div className="p-5 pl-7">
                    <div className="flex justify-between items-start mb-3">
                      <Badge type="type" value={incident.type} />
                      <Badge type="status" value={incident.status} />
                    </div>
                    
                    <h3 className="font-semibold text-lg text-white mb-2 line-clamp-1">{incident.description}</h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{incident.description}</p>
                    
                    <div className="space-y-2 text-xs text-slate-500 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-2 text-slate-400" />
                        {incident.location.address || `${incident.location.lat.toFixed(4)}, ${incident.location.lng.toFixed(4)}`}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-2 text-slate-400" />
                        {new Date(incident.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <button 
                        onClick={() => handleUpvote(incident.id, incident.upvotedBy)}
                        disabled={!!hasUpvoted}
                        className={`flex items-center space-x-1.5 transition-colors group/upvote ${
                          hasUpvoted 
                            ? 'text-electric-blue cursor-default' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title={hasUpvoted ? "You have verified this report" : "Verify this report"}
                      >
                        <ThumbsUp className={`h-4 w-4 ${!hasUpvoted && 'group-hover/upvote:scale-110'} transition-transform`} fill={hasUpvoted ? "currentColor" : "none"} />
                        <span className="text-sm font-medium">{incident.upvotes}</span>
                        <span className="text-xs">{hasUpvoted ? 'Verified' : 'Verify'}</span>
                      </button>
                      {incident.imageUrl && (
                        <span className="text-xs text-blue-400 font-medium">Image Attached</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};