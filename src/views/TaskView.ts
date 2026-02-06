import { Task, ViewHandler } from "../types";

const ICONS = {
    SUCCESS: "✓",
    ERROR: "✗",
    LIST: "📋",
} as const;

function formatTask(task: Readonly<Task>): string {
    const status = task.status.toUpperCase();
    return `[${task.id}] ${status} - ${task.description}`;
}

const addTask: ViewHandler = (result: unknown) => {
    const task = result as Task;
    console.log(`${ICONS.SUCCESS} Task ${task.id} added successfully.`);
    console.log(formatTask(task));
};

const updateTask: ViewHandler = (result: unknown) => {
    const task = result as Task;
    console.log(`${ICONS.SUCCESS} Task ${task.id} updated successfully.`);
    console.log(formatTask(task));
};

const deleteTask: ViewHandler = (result: unknown) => {
    const data = result as { id: string; removed: boolean };
    console.log(`${ICONS.SUCCESS} Task ${data.id} deleted successfully.`);
};

const listTasks: ViewHandler = (result: unknown) => {
    const tasks = result as readonly Task[];
    console.log(`\n${ICONS.LIST} Tasks:`);
    if (tasks.length === 0) {
        console.log("  No tasks found.");
    } else {
        tasks.forEach((task) => {
            console.log(`  ${formatTask(task)}`);
        });
    }
    console.log(`\nTotal: ${tasks.length}`);
};

const error = (message: string): void => {
    console.error(`${ICONS.ERROR} Error: ${message}`);
};

const help = (): void => {
    console.log("Usage: npm start -- <action> [options]\n");
    console.log("Available actions:");
    console.log("  add       --description <text> [--status <status>]");
    console.log(
        "  update    --id <id> [--description <text>] [--status <status>]",
    );
    console.log("  delete    --id <id>");
    console.log("  list      [--status <status>]\n");
    console.log("Status options: todo, in progress, done");
};

export const views = Object.freeze({
    addTask,
    updateTask,
    deleteTask,
    listTasks,
    error,
    help,
    formatTask,
});
