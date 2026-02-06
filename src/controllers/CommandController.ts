import { ITaskRepository } from "../abstractions/ITaskRepository";
import { ITaskCommandController } from "../abstractions/ITaskCommandController";
import { Task, TaskStatus } from "../types";

export class CommandController implements ITaskCommandController {
    constructor(private readonly db: ITaskRepository) {}

    async createTask(params: Readonly<Record<string, unknown>>): Promise<Task> {
        const description = params.description as string;

        return this.db.addTask({
            description,
            status: TaskStatus.TODO,
        });
    }

    async updateTask(params: Readonly<Record<string, unknown>>): Promise<Task> {
        const id = params.id as string;
        const description = params.description as string | undefined;
        const status = params.status as TaskStatus | undefined;

        const updates: Record<string, unknown> = {};
        if (description !== undefined) updates.description = description;
        if (status !== undefined) updates.status = status;

        return this.db.updateTask(
            id,
            updates as Readonly<Partial<Omit<Task, "id" | "createdAt">>>,
        );
    }

    async deleteTask(
        params: Readonly<Record<string, unknown>>,
    ): Promise<{ readonly id: string; readonly removed: boolean }> {
        const id = params.id as string;
        const removed = await this.db.removeTask(id);
        return Object.freeze({ id, removed });
    }

    async execute(
        params: Readonly<Record<string, unknown>>,
    ): Promise<readonly Task[]> {
        const status = params.status as string | undefined;

        if (status === "all" || status === undefined) {
            return this.db.getAll();
        }

        return this.db.getByStatus(status);
    }

    async markInProgress(
        params: Readonly<Record<string, unknown>>,
    ): Promise<Task> {
        const id = params.id as string;
        return this.db.updateTask(id, { status: TaskStatus.IN_PROGRESS });
    }

    async markDone(params: Readonly<Record<string, unknown>>): Promise<Task> {
        const id = params.id as string;
        return this.db.updateTask(id, { status: TaskStatus.DONE });
    }
}
