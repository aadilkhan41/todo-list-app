import { TaskService } from "../services/TaskService.js";

const service = new TaskService();
const send = (res, data, status = 200) => res.status(status).json({ success: true, data });

export class TaskController {
    list = async (req, res) => {
        send(res, await service.listTasks(req.query));
    };

    weekly = async (_req, res) => {
        send(res, await service.weeklySummary());
    };

    get = async (req, res) => {
        send(res, await service.getTask(req.params.id));
    };

    create = async (req, res) => {
        send(res, await service.createTask(req.body), 201);
    };

    update = async (req, res) => {
        send(res, await service.updateTask(req.params.id, req.body));
    };

    toggle = async (req, res) => {
        send(res, await service.toggleTask(req.params.id));
    };

    remove = async (req, res) => {
        await service.deleteTask(req.params.id);
        res.status(204).end();
    };
}