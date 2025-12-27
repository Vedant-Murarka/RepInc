import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IncidentType, Severity } from '../types';
import { useIncidents } from '../context/IncidentContext';
import { Button } from '../components/ui/Button';
import { MapPin, Camera, AlertTriangle, ChevronRight, ChevronLeft, Check } from 'lucide-react';

export const Report: React.FC = () => {
  const navigate = useNavigate();
  const { addIncident } = useIncidents();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    type: IncidentType.FIRE,
    description: '',
    severity: Severity.MEDIUM,
    location: { lat: 0, lng: 0, address: '' },
    image: null as File | null
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
          }
        }));
        setLoading(false);
      }, (error) => {
        console.error("Error getting location", error);
        alert("Could not retrieve location. Please allow permissions or enter manually.");
        setLoading(false);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    addIncident({
      type: formData.type,
      description: formData.description,
      location: formData.location,
      severity: formData.severity,
      imageUrl: formData.image ? URL.createObjectURL(formData.image) : undefined
    });
    
    setLoading(false);
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white">Report Incident</h2>
          <p className="mt-2 text-slate-400">Help us coordinate the response quickly.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-10"></div>
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-electric-blue text-white' : 'bg-slate-800 text-slate-500'}`}
            >
              {s}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
          
          {/* Step 1: Type & Severity */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Incident Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(IncidentType).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, type})}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        formData.type === type 
                          ? 'bg-blue-900/20 border-electric-blue text-white' 
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Severity Assessment</label>
                <div className="flex space-x-2">
                  {[Severity.LOW, Severity.MEDIUM, Severity.HIGH, Severity.CRITICAL].map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setFormData({...formData, severity: sev})}
                      className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                        formData.severity === sev
                          ? sev === Severity.CRITICAL 
                            ? 'bg-red-600 text-white' 
                            : 'bg-slate-700 text-white ring-2 ring-electric-blue'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="button" onClick={handleNext} fullWidth className="mt-4">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Location & Description */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={formData.location.lat !== 0 ? `${formData.location.lat.toFixed(4)}, ${formData.location.lng.toFixed(4)}` : ''}
                    placeholder="Coordinates not set"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-electric-blue"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleLocation} 
                    disabled={loading}
                  >
                    {loading ? 'Locating...' : <><MapPin className="h-4 w-4 mr-1"/> Get GPS</>}
                  </Button>
                </div>
                <p className="text-xs text-slate-500">Allow browser permissions for precise location.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the situation..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <Button type="button" variant="secondary" onClick={handleBack} className="flex-1">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="button" onClick={handleNext} className="flex-1" disabled={!formData.description}>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Media & Review */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Evidence (Optional)</label>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-slate-500 transition-colors">
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, image: e.target.files ? e.target.files[0] : null})}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    {formData.image ? (
                      <div className="text-emerald-500 flex flex-col items-center">
                        <Check className="h-8 w-8 mb-2" />
                        <span className="text-sm">{formData.image.name}</span>
                      </div>
                    ) : (
                      <>
                        <Camera className="h-8 w-8 text-slate-500 mb-2" />
                        <span className="text-sm text-slate-400">Tap to upload photo</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 space-y-2">
                <h4 className="text-sm font-semibold text-slate-200">Summary</h4>
                <div className="text-sm text-slate-400">
                  <p><span className="text-slate-500">Type:</span> {formData.type}</p>
                  <p><span className="text-slate-500">Severity:</span> {formData.severity}</p>
                  <p><span className="text-slate-500">Location:</span> {formData.location.lat ? 'GPS Set' : 'Not Set'}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button type="button" variant="secondary" onClick={handleBack} className="flex-1">
                  Back
                </Button>
                <Button type="submit" variant="danger" className="flex-1" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};
