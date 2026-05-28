'use client';

import { useEffect, useState } from 'react';
import { getDemoUsers } from '@/actions/dbActions';
import { useAuth, User } from '@/context/AuthContext';
import { Building2, UserCircle2, HardHat } from 'lucide-react';

export default function LoginScreen() {
  const { login } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getDemoUsers();
        // If empty, hit seed endpoint
        if (data.length === 0) {
          await fetch('/api/seed');
          const seededData = await getDemoUsers();
          setUsers(seededData as User[]);
        } else {
          setUsers(data as User[]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const owner = users.find(u => u.role === 'OWNER');
  const employee = users.find(u => u.role === 'EMPLOYEE');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
      <div className="mb-8 text-center">
        <div className="bg-blue-600 p-4 rounded-full inline-block mb-4">
          <Building2 className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Go2Roofing Command</h1>
        <p className="text-slate-500 mt-2">Demo Environment Login</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {owner && (
          <button
            onClick={() => login(owner)}
            className="w-full flex items-center p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all group"
          >
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <UserCircle2 className="w-8 h-8" />
            </div>
            <div className="ml-4 text-left">
              <h2 className="text-lg font-bold text-slate-900">Login as Demo Owner</h2>
              <p className="text-sm text-slate-500">Access Command Center Dashboard</p>
            </div>
          </button>
        )}

        {employee && (
          <button
            onClick={() => login(employee)}
            className="w-full flex items-center p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:amber-500 transition-all group"
          >
            <div className="bg-amber-50 text-amber-600 p-3 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <HardHat className="w-8 h-8" />
            </div>
            <div className="ml-4 text-left">
              <h2 className="text-lg font-bold text-slate-900">Login as Demo Employee</h2>
              <p className="text-sm text-slate-500">Access Field Mobile View</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
