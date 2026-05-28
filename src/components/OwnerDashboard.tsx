'use client';

import { useEffect, useState } from 'react';
import { getOwnerDashboardData } from '@/actions/dbActions';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Calendar, Settings, LogOut, Camera, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

type DashboardData = Awaited<ReturnType<typeof getOwnerDashboardData>>;

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getOwnerDashboardData();
        setData(result);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const columns = ['UNSCHEDULED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white flex items-center">
            <span className="bg-blue-600 p-1.5 rounded-lg mr-3">G2</span>
            Command
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button className="flex items-center w-full px-4 py-3 bg-slate-800 text-white rounded-lg transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          <button className="flex items-center w-full px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors">
            <Calendar className="w-5 h-5 mr-3" />
            Master Calendar
          </button>
          <button className="flex items-center w-full px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between px-4 py-2">
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-500">Owner</p>
            </div>
            <button onClick={logout} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content (Kanban) */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden p-6 flex flex-col">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Active Jobs</h2>
          <p className="text-slate-500 text-sm">Real-time status board</p>
        </div>
        
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
          {columns.map(status => (
            <div key={status} className="w-80 flex-shrink-0 flex flex-col bg-slate-100 rounded-xl border border-slate-200">
              <div className="p-4 border-b border-slate-200 bg-slate-50/50 rounded-t-xl">
                <h3 className="font-semibold text-slate-700 flex items-center justify-between">
                  {status.replace('_', ' ')}
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs border border-slate-200">
                    {data.jobs.filter(j => j.status === status).length}
                  </span>
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {data.jobs.filter(j => j.status === status).map(job => (
                  <div key={job.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{job.poNumber}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{job.clientName}</h4>
                    <p className="text-xs text-slate-500 mb-4 truncate">{job.address}</p>
                    
                    {job.assignedCrew && (
                      <div className="flex items-center text-xs text-slate-600 border-t border-slate-100 pt-3">
                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold mr-2">
                          {job.assignedCrew.name.charAt(0)}
                        </div>
                        {job.assignedCrew.name}
                      </div>
                    )}

                    {job.tasks.length > 0 && (
                      <div className="mt-3 bg-slate-50 rounded-lg p-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">Progress</span>
                          <span className="font-medium text-slate-700">
                            {Math.round((job.tasks.filter(t => t.isCompleted).length / job.tasks.length) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${(job.tasks.filter(t => t.isCompleted).length / job.tasks.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar (Live Feed) */}
      <aside className="w-80 bg-white border-l border-slate-200 flex flex-col hidden lg:flex">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 flex items-center">
            <Camera className="w-4 h-4 mr-2 text-blue-600" />
            Live Photo Feed
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {data.recentPhotos.length === 0 ? (
            <p className="text-sm text-slate-500 text-center mt-10">No recent photos.</p>
          ) : (
            data.recentPhotos.map(photo => (
              <div key={photo.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    {photo.uploadedBy.name}
                  </span>
                  <span className="text-slate-400">{format(new Date(photo.timestamp), 'h:mm a')}</span>
                </div>
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.imageUrl} alt="Field photo" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                    {photo.category}
                  </div>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {photo.job.clientName} • {photo.job.poNumber}
                </p>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
