import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Activity, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Landing: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col justify-center items-center text-center px-4 py-20 overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-blue/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emergency-red/5 rounded-full blur-3xl -z-10 animate-pulse"></div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-electric-blue text-sm mb-4">
            <span className="flex h-2 w-2 relative mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            System Operational • 24/7 Monitoring
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Response Speed <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emergency-red to-orange-500">
              Saves Lives
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            PROMETEO 2026 is an advanced incident coordination platform bridging the gap between citizen reporting and emergency response.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/report">
              <Button variant="danger" size="lg" className="w-full sm:w-auto shadow-lg shadow-red-900/20">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Report Incident
              </Button>
            </Link>
            <Link to="/feed">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Activity className="mr-2 h-5 w-5" />
                View Live Feed
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Stats Ticker */}
      <div className="bg-slate-900 border-y border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
            <div className="p-2">
              <div className="text-3xl font-bold text-white">12</div>
              <div className="text-sm text-slate-500 mt-1 uppercase tracking-wider">Active Incidents</div>
            </div>
            <div className="p-2">
              <div className="text-3xl font-bold text-emerald-500">845</div>
              <div className="text-sm text-slate-500 mt-1 uppercase tracking-wider">Resolved</div>
            </div>
            <div className="p-2">
              <div className="text-3xl font-bold text-electric-blue">42</div>
              <div className="text-sm text-slate-500 mt-1 uppercase tracking-wider">Responders</div>
            </div>
            <div className="p-2">
              <div className="text-3xl font-bold text-orange-500">3m</div>
              <div className="text-sm text-slate-500 mt-1 uppercase tracking-wider">Avg Response</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
              <MapPin className="h-10 w-10 text-electric-blue mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Geolocation Tracking</h3>
              <p className="text-slate-400">Pinpoint incident locations instantly with GPS integration for faster dispatch routing.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
              <CheckCircle className="h-10 w-10 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Crowd Verification</h3>
              <p className="text-slate-400">Community upvoting system helps filters noise and prioritize verified emergencies.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
              <Activity className="h-10 w-10 text-emergency-red mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Real-Time Sync</h3>
              <p className="text-slate-400">Live data feed ensures responders and citizens have the same up-to-the-second information.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
