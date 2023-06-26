import { config } from "../api";
import { NotificationPayload } from "../types/notification-payload";
import { NotificationScheduleResult } from "../types/notification-schedule-result";
import { operationFailed } from "../utils/error-handler";

/** @hidden */
interface INotification {
    send: Function;
}

/** @hidden */
export default class Notification implements INotification {
    schedulePayload: NotificationPayload;

    constructor(payload: NotificationPayload) {
        this.schedulePayload = {
            title: payload.title,
            body: payload.body,
            ...payload.mediaURL && {mediaURL: payload.mediaURL},
            ...payload.label && {label: payload.label},
            ...payload.scheduleInterval ? { scheduleInterval: payload.scheduleInterval } : { scheduleInterval: 86400 }
        };
    }

    send(): Promise<NotificationScheduleResult> {
        const url: string = this.getScheduleURL_Facebook();
        const body: string = this.buildSchedulePayload_Facebook();

        return new Promise(() => {
            const request = new XMLHttpRequest();
            request.open("POST", url);
            request.setRequestHeader("Content-Type", "application/json");

            request.onload = () => {
                if (request.status === 200) {
                    const response = JSON.parse(request.responseText);
                    return {
                        id: response.notification_id,
                        success: response.success,
                    }
                } else {
                    throw operationFailed(`[Wortal] Failed to schedule notification. Request failed with status code: ${request.status}. \n Message: ${JSON.stringify(request.responseText)}`,"notifications.scheduleAsync");
                }
            }

            request.onerror = () => {
                throw operationFailed("[Wortal] Failed to schedule notification. This may be caused by a server issue or a malformed request.", "notifications.scheduleAsync");
            };

            request.send(body);
        });
    }

    buildSchedulePayload_Facebook(): string {
        let body = {
            message: {
                title: this.schedulePayload.title,
                body: this.schedulePayload.body,
                ...this.schedulePayload.mediaURL && {media_url: this.schedulePayload.mediaURL}
            },
            ...this.schedulePayload.label && {label: this.schedulePayload.label},
            ...this.schedulePayload.scheduleInterval && {schedule_interval: this.schedulePayload.scheduleInterval},
        };

        return JSON.stringify(body);
    }

    getScheduleURL_Facebook(): string {
        return `https://html5gameportal.com/api/v1/notification/${config.session.gameId}/fb/${config.player.asid}`;
    }
}
