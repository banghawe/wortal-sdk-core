import { config } from "../api";

/** @hidden */
export function debug(message: string) {
    const prefix: string = "[Wortal] ";

    if (config.isDebugMode) {
        console.log(prefix + message);
    }
}
