import { promises as fs } from "fs";
import { Task, TaskStatus } from "../types";
import { TASKS_PATH, STATUS } from "../config";
import { NotFoundError } from "../errors";
import { ITaskRepository } from "../abstractions/ITaskRepository";

export class TaskDB implements ITaskRepository {
    private readonly path: string = TASKS_PATH;
    private readonly data: Map<string, Task> = new Map();
    private readonly readyPromise: Promise<void>;

    constructor() {
        this.readyPromise = this.initialize();
    }

    get ready(): Promise<void> {
        return this.readyPromise;
    }

    private async initialize(): Promise<void> {
        try {
            await this.ensureFile();
            const content = await fs.readFile(this.path, "utf8");
            const parsed = JSON.parse(content) ?? {};

            if (Array.isArray(parsed)) {
                parsed.forEach((task: unknown) => {
                    const typedTask = task as Task;
                    this.data.set(typedTask.id, typedTask);
                });
            } else if (typeof parsed === "object" && parsed !== null) {
                Object.entries(parsed).forEach(([id, task]) => {
                    this.data.set(id, task as Task);
                });
            }
        } catch {
            this.data.clear();
            await this.write();
        }
    }

    private async ensureFile(): Promise<void> {
        try {
            await fs.access(this.path);
        } catch {
            await fs.writeFile(this.path, "{}", "utf8");
        }
    }

    static createTaskId(): string {
        return Date.now().toString(36);
    }

    async waitForReady(): Promise<void> {
        await this.readyPromise;
    }

    private async write(): Promise<void> {
        const obj: Record<string, Task> = {};
        this.data.forEach((task, id) => {
            obj[id] = task;
        });
        await fs.writeFile(this.path, JSON.stringify(obj, null, 2), "utf8");
    }

    async addTask(
        taskData: Readonly<{
            description: string;
            status: TaskStatus;
        }>,
    ): Promise<Task> {
        await this.readyPromise;
        const id = TaskDB.createTaskId();
        const now = Date.now();

        const task: Task = Object.freeze({
            id,
            description: taskData.description,
            status: taskData.status,
            createdAt: now,
            updatedAt: now,
        });

        this.data.set(id, task);
        await this.write();
        return task;
    }

    async updateTask(
        id: string,
        updates: Readonly<Partial<Omit<Task, "id" | "createdAt">>>,
    ): Promise<Task> {
        await this.readyPromise;
        const task = this.data.get(id);
        if (!task) {
            throw new NotFoundError("Task", id);
        }

        const updated: Task = Object.freeze({
            id: task.id,
            description: updates.description ?? task.description,
            status: updates.status ?? task.status,
            createdAt: task.createdAt,
            updatedAt: Date.now(),
        });

        this.data.set(id, updated);
        await this.write();
        return updated;
    }

    async removeTask(id: string): Promise<boolean> {
        await this.readyPromise;
        if (!this.data.has(id)) {
            throw new NotFoundError("Task", id);
        }
        this.data.delete(id);
        await this.write();
        return true;
    }

    async getAll(): Promise<readonly Task[]> {
        await this.readyPromise;
        return Object.freeze(Array.from(this.data.values()));
    }

    async getById(id: string): Promise<Task | undefined> {
        await this.readyPromise;
        return this.data.get(id);
    }

    async getByStatus(status: string): Promise<readonly Task[]> {
        await this.readyPromise;

        const tasks = Array.from(this.data.values());

        if (status === "not_done") {
            return Object.freeze(tasks.filter((t) => t.status !== STATUS.DONE));
        }

        if (status === "in_progress") {
            return Object.freeze(
                tasks.filter((t) => t.status === STATUS.IN_PROGRESS),
            );
        }

        if (status === "done") {
            return Object.freeze(tasks.filter((t) => t.status === STATUS.DONE));
        }

        return Object.freeze(tasks);
    }
}
