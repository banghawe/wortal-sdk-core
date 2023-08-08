const logPrefix: string = "[Wortal] ";

/** @hidden */
export function debug(message: string, args?: any): void {
    console.debug(logPrefix + message, args !== undefined ? args : "");
}

/** @hidden */
export function info(message: string) {
    console.log(logPrefix + message);
}

/** @hidden */
export function warn(message: string) {
    console.warn(logPrefix + message);
}
