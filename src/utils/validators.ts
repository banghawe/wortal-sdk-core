import { AuthPayload } from "../interfaces/wortal";
import { PlacementType } from "../types/ads";
import { ShareTo } from "../types/wortal";

/** @hidden */
export function isValidString(obj: any): boolean {
    return (typeof obj === "string" && obj !== "");
}

/** @hidden */
export function isValidNumber(obj: any): boolean {
    if (typeof obj !== "number") {
        return false;
    } else {
        return !isNaN(obj);
    }
}

/** @hidden */
export function isValidPlacementType(value: any): value is PlacementType {
    return ['preroll', 'start', 'pause', 'next', 'browse', 'reward'].includes(value);
}

/** @hidden */
export function isValidPayloadText(obj: any): boolean {
    if (typeof obj === "string" && obj !== "") {
        return true;
    } else if (typeof obj === "object") {
        if (typeof obj.default === "string" && obj.default !== "") {
            return true;
        }
    }
    return false;
}

/** @hidden */
export function isValidPayloadImage(obj: any): boolean {
    if (typeof obj === "string" && obj !== "") {
        if (obj.startsWith("data:")) {
            return true;
        }
    }
    return false;
}

/** @hidden */
export function isValidPurchaseConfig(obj: any): boolean {
    return (typeof obj.productID === "string" && obj.productID !== "");
}

/** @hidden */
export function isValidShareDestination(value: any): value is ShareTo {
    return ['facebook', 'twitter'].includes(value);
}

/** @hidden */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
}

/** @hidden */
export function isValidAuthPayload_iDev(payload: AuthPayload): boolean {
    if (payload.action === "login") {
        return isValidString(payload.email) && isValidEmail(payload.email) && isValidString(payload.password);
    } else if (payload.action === "register") {
        return isValidString(payload.email) && isValidEmail(payload.email) && isValidString(payload.username) && isValidString(payload.password);
    } else if (payload.action === "reset") {
        return isValidString(payload.email) && isValidEmail(payload.email);
    } else {
        return false;
    }
}
