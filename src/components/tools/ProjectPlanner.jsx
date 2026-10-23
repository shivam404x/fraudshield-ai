import React, { useState } from 'react';
import { Kanban, Plus, Trash2, CheckCircle2, Clock, Users } from 'lucide-react';

export default function ProjectPlanner() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Set up eBPF Linux probe daemon', column: 'done', assignee: 'Priya', tag: 'Systems' },
    { id: '2', title: 'Implement Claude 3.5 AST patch logic', column: 'done', assignee: 'Alex', tag: 'AI Core' },
    { id: '3', title: 'Build Docker ephemeral sandbox tester', column: 'in-progress', assignee: 'David', tag: 'DevOps' },
    { id: '4', title: 'Finalize 3-minute pitch deck slides', column: 'in-progress', assignee: 'Alex', tag: 'Pitch' },
    { id: '5', title: 'Record 2-minute video walkthrough', column: 'todo', assignee: 'David', tag: 'Media' },
    { id: '6', title: 'Test Devpost submission link and repo', column: 'todo', assignee: 'Team', tag: 'Submit' }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskColumn, setNewTaskColumn] = useState('todo');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([
      ...tasks,
      {
        id: String(Date.now()),
        title: newTaskTitle.trim(),
        column: newTaskColumn,
        assignee: 'Alex',
        tag: 'Feature'
      }
    ]);
    setNewTaskTitle('');
  };

  const moveTask = (id, newCol) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, column: newCol } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const columns = [
    { id: 'todo', title: 'Backlog / To Do', color: 'border-slate-300' },
    { id: 'in-progress', title: 'In Progress (Active Sprint)', color: 'border-indigo-400 bg-indigo-50/20' },
    { id: 'done', title: 'Shipped & Verified', color: 'border-emerald-400 bg-emerald-50/20' }
  ];

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Kanban className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 font-sans">
              24-Hour Hackathon Sprint Kanban
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              Track tasks, assign team responsibilities, and hit the submission deadline.
            </p>
          </div>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleAddTask} className="flex items-center gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add new task..."
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs w-48 sm:w-64 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow hover:bg-indigo-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Board Columns */}
      <div className="flex-1 overflow-x-auto p-6 flex gap-5">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.column === col.id);
          return (
            <div
              key={col.id}
              className={`w-80 shrink-0 rounded-2xl border-2 ${col.color} bg-white flex flex-col justify-between shadow-xs p-4`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                  <span className="font-black text-xs uppercase tracking-wider text-slate-800 font-sans">
                    {col.title}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards Stack */}
                <div className="space-y-2.5 overflow-y-auto max-h-[60vh]">
                  {colTasks.map(task => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-400 shadow-xs flex flex-col justify-between gap-2 group transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-slate-900 leading-snug">
                          {task.title}
                        </span>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="hidden group-hover:block text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                          {task.tag}
                        </span>
                        <span>👤 {task.assignee}</span>
                      </div>

                      {/* Move status buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold">
                        {task.column !== 'todo' && (
                          <button onClick={() => moveTask(task.id, 'todo')} className="text-slate-500 hover:text-slate-800">
                            ← Backlog
                          </button>
                        )}
                        {task.column !== 'in-progress' && (
                          <button onClick={() => moveTask(task.id, 'in-progress')} className="text-indigo-600 hover:text-indigo-800">
                            ▶ In Progress
                          </button>
                        )}
                        {task.column !== 'done' && (
                          <button onClick={() => moveTask(task.id, 'done')} className="text-emerald-600 hover:text-emerald-800">
                            ✔ Done
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Summary at Bottom */}
              <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Total tasks</span>
                <span>{colTasks.length}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
