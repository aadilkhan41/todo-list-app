import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { weekStartOf } from "../utils/dates.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function toPublic(doc) {
    const { _id, id, weekStart: _weekStart, ...rest } = doc;
    return { id: id ?? _id?.toString(), ...rest };
}

export class TaskService {
    async listTasks({ q: search, from, to, done } = {}) {
        const filter = {};
        if (search) {
            const pattern = new RegExp(escapeRegex(search), "i");
            filter.$or = [{ title: pattern }, { desc: pattern }];
        }
        if (from || to) filter.date = { ...(from && { $gte: from }), ...(to && { $lte: to }) };
        if (done === "true" || done === "false") filter.done = done === "true";

        const tasks = await Task.find(filter).sort({ date: 1, start: 1 }).lean();
        return tasks.map(toPublic);
    }

    async getTask(id) {
        const task = await Task.findById(id);
        if (!task) throw ApiError.notFound("Task not found");
        return task;
    }

    async createTask(input) {
        const title = input.title?.trim();
        if (!title || !input.date || !input.start) {
            throw ApiError.badRequest("title, date and start are required");
        }

        return Task.create({
            title,
            desc: input.desc?.trim() || "",
            date: input.date,
            start: input.start,
            end: input.end || "",
            pri: input.pri || "",
            done: Boolean(input.done),
            weekStart: weekStartOf(input.date),
        });
    }

    async updateTask(id, patch) {
        const updates = { ...patch };
        if (updates.title !== undefined) updates.title = String(updates.title).trim();
        if (updates.desc !== undefined) updates.desc = String(updates.desc).trim();
        if (updates.date) updates.weekStart = weekStartOf(updates.date);

        const task = await Task.findByIdAndUpdate(id, { $set: updates }, { new: true });
        if (!task) throw ApiError.notFound("Task not found");
        return task;
    }

    async toggleTask(id) {
        const task = await Task.findById(id);
        if (!task) throw ApiError.notFound("Task not found");
        task.done = !task.done;
        return task.save();
    }

    async deleteTask(id) {
        const task = await Task.findByIdAndDelete(id);
        if (!task) throw ApiError.notFound("Task not found");
    }

    async weeklySummary() {
        return Task.aggregate([
        {
            $group: {
            _id: "$weekStart",
            total: { $sum: 1 },
            completed: { $sum: { $cond: ["$done", 1, 0] } },
            },
        },
        {
            $project: {
            _id: 0,
            weekStart: "$_id",
            total: 1,
            completed: 1,
            open: { $subtract: ["$total", "$completed"] },
            },
        },
        { $sort: { weekStart: -1 } },
        ]);
    }
}