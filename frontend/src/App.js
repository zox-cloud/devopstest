import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart, Bar,
    XAxis, YAxis,
    Tooltip, ResponsiveContainer
} from 'recharts';

const API = 'http://localhost:4000';

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('todo');

   
    const fetchTasks = () => {
        axios.get(`${API}/api/tasks`)
            .then(res => setTasks(res.data))
            .catch(console.error);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

 
    const addTask = () => {
        if (!title) return;
        axios.post(`${API}/api/tasks`, { title, status })
            .then(() => {
                setTitle('');
                return axios.get(`${API}/api/tasks`);
            })
            .then(res => setTasks(res.data))
            .catch(console.error);
    };

    
    const updateTask = (id, newStatus) => {
        axios.put(`${API}/api/tasks/${id}`, { status: newStatus })
            .then(() => fetchTasks())
            .catch(console.error);
    };

   
    const deleteTask = (id) => {
        axios.delete(`${API}/api/tasks/${id}`)
            .then(() => fetchTasks())
            .catch(console.error);
    };

    
    const counts = tasks.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
    }, {});
    const chartData = Object.entries(counts).map(([status, count]) => ({ status, count }));

    return (
        <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
            <h1 style={{ textAlign: 'center' }}>📝 Task Tracker</h1>

            
            <div style={{ margin: '1rem 0', display: 'flex', gap: '1rem' }}>
                <input
                    style={{ flex: 1, padding: 8 }}
                    placeholder="New task title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
                <button onClick={addTask}>Add</button>
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
                
                <table style={{ flex: 1, borderCollapse: 'collapse' }}>
                    <thead>
                    <tr>
                        <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>ID</th>
                        <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Title</th>
                        <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Status</th>
                        <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.map(t => (
                        <tr key={t.id}>
                            <td>{t.id}</td>
                            <td>{t.title}</td>
                            <td>
                                <select
                                    value={t.status}
                                    onChange={e => updateTask(t.id, e.target.value)}
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </td>
                            <td>
                                <button onClick={() => deleteTask(t.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                
                <div style={{ flex: 1 }}>
                    <h2>Tasks by Status</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="status" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

