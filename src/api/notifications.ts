import { NotificationPayload } from "../types/notification-payload";
import { NotificationScheduleResult } from "../types/notification-schedule-result";
import ScheduledNotification from "../models/scheduled-notification";
import Notification from "../models/notification";
import { invalidParams, notSupported, operationFailed } from "../utils/error-handler";
import { isValidString } from "../utils/validators";
import { config } from "./index";

/** @hidden */
const URL_PREFIX: string = "https://html5gameportal.com/api/v1/notification";

/**
 * Schedule a notification to be delivered to the player at a later time.
 * @example
 * Wortal.notifications.scheduleAsync({
 *    title: "Your energy is full!",
 *    body: "Come back and play again.",
 *    mediaURL: "https://example.com/image.png",
 *    label: "resources-full",
 *    scheduleInterval: 300 // 5 minutes
 * }).then((result) => {
 *   console.log(result.id);
 * });
 * @param payload Object defining the notification to be scheduled.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * </ul>
 */
export function scheduleAsync(payload: NotificationPayload): Promise<NotificationScheduleResult> {
    const platform = config.session.platform;
    if (platform !== "facebook") {
        throw notSupported("Notifications not supported on platform: " + platform, "notifications.scheduleAsync");
    }
    if (!isValidString(payload.title)) {
        throw invalidParams("Title cannot be null or empty.", "notifications.scheduleAsync");
    }
    if (!isValidString(payload.body)) {
        throw invalidParams("Body cannot be null or empty.", "notifications.scheduleAsync");
    }

    return Promise.resolve().then(() => {
        const notification = new Notification(payload);
        return notification.send();
    });
}

/**
 * Gets the history of scheduled notifications for the past 30 days.
 * @example
 * Wortal.notifications.getHistoryAsync().then((notifications) => {
 *   notifications.forEach((notification) => {
 *   console.log(notification.id);
 *   console.log(notification.status);
 * });
 * @returns {Promise<ScheduledNotification[]>} Promise that contains an array of notifications scheduled.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>OPERATION_FAILED</li>
 * </ul>
 */
export function getHistoryAsync(): Promise<ScheduledNotification[]> {
    const platform = config.session.platform;
    if (platform !== "facebook") {
        throw notSupported("Notifications not supported on platform: " + platform, "notifications.getHistoryAsync");
    }

    const url: string = _getHistoryURL_Facebook();
    return new Promise((resolve) => {
        const request = new XMLHttpRequest();
        request.open("GET", url);
        request.setRequestHeader("Content-Type", "application/json");

        request.onload = () => {
            if (request.status === 200) {
                const response = JSON.parse(request.responseText);
                const notifications = response["data"].map((notification: any) => {
                    return new ScheduledNotification({
                        id: notification["notification_id"],
                        status: notification["status"],
                        createdTime: notification["schedule_date"],
                        ...(notification["label"] && { label: notification["label"] })
                    });
                });
                resolve(notifications);
            } else {
                throw operationFailed(`[Wortal] Failed to get notifications. Request failed with status code: ${request.status}. \n Message: ${JSON.stringify(request.responseText)}`,"notifications.getHistoryAsync");
            }
        }

        request.onerror = () => {
            throw operationFailed("[Wortal] Failed to get notification. This may be caused by a server issue or a malformed request.", "notifications.getHistoryAsync");
        };

        request.send();
    });
}

/**
 * Cancels a scheduled notification.
 * @example
 * Wortal.notifications.cancelAsync("1234567890");
 * @param id ID of the notification to cancel.
 * @returns {Promise<boolean>} Promise that resolves true if the notification was cancelled successfully, false otherwise.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>OPERATION_FAILED</li>
 * </ul>
 */
export function cancelAsync(id: string): Promise<boolean> {
    const platform = config.session.platform;
    if (platform !== "facebook") {
        throw notSupported("Notifications not supported on platform: " + platform, "notifications.cancel");
    }
    if (!isValidString(id)) {
        throw invalidParams("ID cannot be null or empty.", "cancelNotification");
    }

    const url = _getCancelURL_Facebook();
    return new Promise((resolve) => {
        const request = new XMLHttpRequest();
        request.open("POST", url);
        request.setRequestHeader("Content-Type", "application/json");

        request.onload = () => {
            if (request.status === 200) {
                const response = JSON.parse(request.responseText);
                resolve(response["success"]);
            } else {
                throw operationFailed(`[Wortal] Failed to cancel notification. Request failed with status code: ${request.status}. \n Message: ${JSON.stringify(request.responseText)}`,"notifications.cancelAsync");
            }
        }

        request.onerror = () => {
            throw operationFailed("[Wortal] Failed to cancel notification. This may be caused by a server issue or a malformed request.", "notifications.cancelAsync");
        };

        request.send(JSON.stringify({ notification_id: id }));
    });
}

/**
 * Cancels all scheduled notifications.
 * @example
 * Wortal.notifications.cancelAllAsync();
 * @param label Optional label of the notification category to cancel. If this is used then only notifications with the
 * specified label will be cancelled.
 * @returns {Promise<boolean>} Promise that resolves true if all notifications were cancelled successfully, false otherwise.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>OPERATION_FAILED</li>
 * </ul>
 */
export function cancelAllAsync(label?: string): Promise<boolean> {
    const platform = config.session.platform;
    if (platform !== "facebook") {
        throw notSupported("Notifications not supported on platform: " + platform, "notifications.cancelAll");
    }

    const url = _getCancelAllURL_Facebook();
    return new Promise((resolve) => {
        const request = new XMLHttpRequest();
        request.open("POST", url);
        request.setRequestHeader("Content-Type", "application/json");

        request.onload = () => {
            if (request.status === 200) {
                const response = JSON.parse(request.responseText);
                resolve(response["success"]);
            } else {
                throw operationFailed(`[Wortal] Failed to cancel all notifications. Request failed with status code: ${request.status}. \n Message: ${JSON.stringify(request.responseText)}`,"notifications.cancelAllAsync");
            }
        }

        request.onerror = () => {
            throw operationFailed("[Wortal] Failed to cancel all notifications. This may be caused by a server issue or a malformed request.", "notifications.cancelAllAsync");
        };

        request.send(typeof label !== "undefined" ? JSON.stringify({ label: label }) : undefined);
    });
}

function _getHistoryURL_Facebook(): string {
    return `${URL_PREFIX}/${config.session.gameId}/fb/${config.player.asid}`;
}

function _getCancelURL_Facebook(): string {
    return `${URL_PREFIX}/${config.session.gameId}/fb/${config.player.asid}/cancel_notification`;
}

function _getCancelAllURL_Facebook(): string {
    return `${URL_PREFIX}/${config.session.gameId}/fb/${config.player.asid}/cancel_all_notifications`;
}
