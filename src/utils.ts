import { isValidAction, buildParams } from "./validation";
import { CliError } from "./errors";
import { ActionType } from "./config";

const QUOTED_STRING_RE = /(?:"([^"]*)"|'([^']*)'|([^\s"']+))/g;

function tokenize(input: string | readonly string[]): string[] {
    if (typeof input !== "string") {
        return [...input];
    }
    const tokens: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = QUOTED_STRING_RE.exec(input)) !== null) {
        tokens.push(m[1] ?? m[2] ?? m[3] ?? "");
    }
    return tokens;
}

export function parseToJson(
    input: string | readonly string[],
): Readonly<Record<string, unknown>> | null {
    const args = tokenize(input);
    if (!args?.length) return null;

    const action = args[0];
    if (!isValidAction(action)) {
        throw new CliError(`Unknown action: ${action}`);
    }

    const params: Record<string, string> = {};
    for (let i = 1; i < args.length; i++) {
        const token = args[i];
        if (!token.startsWith("-")) {
            throw new CliError(
                `Invalid parameter "${token}". Parameters must start with '-' or '--'`,
            );
        }

        const key = token.replace(/^-+/, "");
        const eqIndex = key.indexOf("=");

        if (eqIndex !== -1) {
            params[key.substring(0, eqIndex)] = key.substring(eqIndex + 1);
        } else if (i + 1 < args.length && !args[i + 1].startsWith("-")) {
            params[key] = args[++i] ?? "";
        } else {
            params[key] = "";
        }
    }

    return buildParams(action as ActionType, params);
}
