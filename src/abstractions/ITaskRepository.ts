import { Task, TaskStatus } from "../types";

export interface ITaskRepository {
    readonly ready: Promise<void>;
    addTask(
        taskData: Readonly<{ description: string; status: TaskStatus }>,
    ): Promise<Task>;
    updateTask(
        id: string,
        updates: Readonly<Partial<Omit<Task, "id" | "createdAt">>>,
    ): Promise<Task>;
    removeTask(id: string): Promise<boolean>;
    getAll(): Promise<readonly Task[]>;
    getById(id: string): Promise<Task | undefined>;
    getByStatus(status: string): Promise<readonly Task[]>;
}
