export interface ITaskCommandController {
    createTask(params: Readonly<Record<string, unknown>>): Promise<unknown>;
    updateTask(params: Readonly<Record<string, unknown>>): Promise<unknown>;
    deleteTask(params: Readonly<Record<string, unknown>>): Promise<unknown>;
    execute(params: Readonly<Record<string, unknown>>): Promise<unknown>;
}
