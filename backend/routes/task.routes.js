import { Router } from "express";
import { TaskController } from "../controllers/TaskController.js";

export function createTaskRoutes() {
    const ctrl = new TaskController();
    const router = Router();

    router.get("/", ctrl.list);
    router.get("/weekly", ctrl.weekly);
    router.post("/", ctrl.create);
    router.get("/:id", ctrl.get);
    router.patch("/:id", ctrl.update);
    router.patch("/:id/toggle", ctrl.toggle);
    router.delete("/:id", ctrl.remove);

    return router;
}