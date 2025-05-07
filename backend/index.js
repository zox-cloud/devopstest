const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// В памяти храним задачи
let nextId = 1;
const tasks = [];

// GET /api/tasks — вернуть все
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// POST /api/tasks — создать
app.post('/api/tasks', (req, res) => {
    const { title, status = 'todo' } = req.body;
    const task = { id: nextId++, title, status };
    tasks.push(task);
    res.status(201).json(task);
});

// PUT /api/tasks/:id — обновить
app.put('/api/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) return res.status(404).json({ error: 'Not found' });

    const { title, status } = req.body;
    if (title !== undefined) task.title = title;
    if (status !== undefined) task.status = status;
    res.json(task);
});

// DELETE /api/tasks/:id — удалить
app.delete('/api/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });

    tasks.splice(idx, 1);
    res.status(204).end();
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
