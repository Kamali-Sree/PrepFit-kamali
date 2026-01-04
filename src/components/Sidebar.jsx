import React from 'react';
import { LayoutDashboard, BookOpen, Sparkles, LogOut, User as UserIcon } from 'lucide-react';

export default function Sidebar({ activeView, setView, user, onLogout }) {
  const menuItems = [
    { id: 'prediction', label: 'Predictions', icon: LayoutDashboard },
    { id: 'questions', label: 'Questions', icon: BookOpen },
    { id: 'gemini', label: 'Gemini Analysis', icon: Sparkles },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
      {/* Brand */}
      <div className="p-8">
        <h1 className="text-3xl font-black gradient-text tracking-tighter">PrepFit.</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">ML Analytics</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
              activeView === item.id 
                ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <item.icon size={22} strokeWidth={activeView === item.id ? 2.5 : 2} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-6">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-xl shadow-sm border border-white" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <UserIcon size={20} />
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">{user.displayName}</p>
            <p className="text-[10px] font-medium text-slate-400 truncate uppercase">{user.email}</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 text-slate-500 font-bold text-xs hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={16} />
          SIGN OUT
        </button>
      </div>
    </aside>
  );
}