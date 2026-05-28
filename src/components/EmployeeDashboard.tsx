'use client';

import { useEffect, useState } from 'react';
import { getEmployeeTodayJob, toggleTaskCompletion, clockInEmployee, clockOutEmployee, getActiveTimeLog, uploadPhotoAction } from '@/actions/dbActions';
import { useAuth } from '@/context/AuthContext';
import { LogOut, MapPin, CheckCircle2, Circle, Camera, Clock, CheckCircle } from 'lucide-react';

type JobData = NonNullable<Awaited<ReturnType<typeof getEmployeeTodayJob>>>;
type TimeLogData = Awaited<ReturnType<typeof getActiveTimeLog>>;

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const [job, setJob] = useState<JobData | null>(null);
  const [timeLog, setTimeLog] = useState<TimeLogData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    try {
      const jobData = await getEmployeeTodayJob(user.id);
      setJob(jobData);
      if (jobData) {
        const logData = await getActiveTimeLog(user.id, jobData.id);
        setTimeLog(logData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // Keep UI synced
    return () => clearInterval(interval);
  }, [user]);

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    await toggleTaskCompletion(taskId, !currentStatus);
    await fetchData(); // Optimistic update could be added here
  };

  const handleClockIn = async () => {
    if (!user || !job) return;
    await clockInEmployee(user.id, job.id);
    await fetchData();
  };

  const handleClockOut = async () => {
    if (!timeLog) return;
    await clockOutEmployee(timeLog.id);
    await fetchData();
  };

  const handleSimulatePhotoUpload = async (category: string) => {
    if (!user || !job) return;
    // Simulate photo upload with a random image from Unsplash
    const imageUrl = `https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400&h=300&random=${Math.random()}`;
    await uploadPhotoAction(job.id, user.id, category, imageUrl);
    alert(`${category} photo uploaded successfully!`);
    await fetchData();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-bold text-slate-900">Today's Assignment</h1>
          <p className="text-xs text-slate-500">{user?.name}</p>
        </div>
        <button onClick={logout} className="p-2 bg-slate-100 rounded-full text-slate-600 active:bg-slate-200">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 p-4 space-y-6">
        {!job ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-200 mt-10">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">You're all caught up!</h2>
            <p className="text-slate-500">No jobs assigned for today or all jobs completed.</p>
          </div>
        ) : (
          <>
            {/* Job Details Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <div className="inline-block bg-blue-100 text-blue-700 font-bold text-xs px-2 py-1 rounded-md mb-3">
                {job.poNumber}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{job.clientName}</h2>
              <div className="flex items-start text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <MapPin className="w-5 h-5 mr-2 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{job.address}</span>
              </div>
            </div>

            {/* Clock In / Out Gate */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 text-center">
              {!timeLog ? (
                <button
                  onClick={handleClockIn}
                  className="w-full py-6 bg-blue-600 text-white rounded-xl font-bold text-xl shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center"
                >
                  <Clock className="w-6 h-6 mr-3" />
                  CLOCK IN TO START
                </button>
              ) : (
                <button
                  onClick={handleClockOut}
                  className="w-full py-6 bg-rose-600 text-white rounded-xl font-bold text-xl shadow-lg shadow-rose-200 active:scale-95 transition-transform flex items-center justify-center"
                >
                  <Clock className="w-6 h-6 mr-3" />
                  CLOCK OUT
                </button>
              )}
            </div>

            {/* Scope Checklist */}
            <div className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-200 transition-opacity duration-300 ${!timeLog ? 'opacity-50 pointer-events-none' : ''}`}>
              <h3 className="font-bold text-lg text-slate-900 mb-4">Scope of Work</h3>
              <div className="space-y-3">
                {job.tasks.map(task => (
                  <button
                    key={task.id}
                    onClick={() => handleToggleTask(task.id, task.isCompleted)}
                    className="w-full flex items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 active:bg-slate-200"
                  >
                    <div className={`mr-4 shrink-0 transition-colors ${task.isCompleted ? 'text-green-500' : 'text-slate-300'}`}>
                      {task.isCompleted ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                    </div>
                    <span className={`text-left text-lg font-medium ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {task.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Folders */}
            <div className={`space-y-3 transition-opacity duration-300 ${!timeLog ? 'opacity-50 pointer-events-none' : ''}`}>
              <h3 className="font-bold text-lg text-slate-900 mb-2 px-1">Job Photos</h3>
              
              <button onClick={() => handleSimulatePhotoUpload('BEFORE')} className="w-full bg-slate-800 text-white p-5 rounded-2xl font-bold text-lg flex items-center shadow-md active:scale-95 transition-transform">
                <div className="bg-slate-700 p-3 rounded-xl mr-4">
                  <Camera className="w-6 h-6" />
                </div>
                Take BEFORE Photo
              </button>

              <button onClick={() => handleSimulatePhotoUpload('DURING')} className="w-full bg-blue-600 text-white p-5 rounded-2xl font-bold text-lg flex items-center shadow-md active:scale-95 transition-transform shadow-blue-200">
                <div className="bg-blue-500 p-3 rounded-xl mr-4">
                  <Camera className="w-6 h-6" />
                </div>
                Take DURING Photo
              </button>

              <button onClick={() => handleSimulatePhotoUpload('AFTER')} className="w-full bg-emerald-600 text-white p-5 rounded-2xl font-bold text-lg flex items-center shadow-md active:scale-95 transition-transform shadow-emerald-200">
                <div className="bg-emerald-500 p-3 rounded-xl mr-4">
                  <Camera className="w-6 h-6" />
                </div>
                Take AFTER Photo
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
