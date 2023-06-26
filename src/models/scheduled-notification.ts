import { NotificationData } from "../types/notification-data";
import { NotificationStatus } from "../types/notification-status";

/** @hidden */
export default class ScheduledNotification {
    private notificationData: NotificationData;

    constructor(data: NotificationData) {
        this.notificationData = data;
    }

    get id(): string {
        return this.notificationData.id;
    }

    get status(): NotificationStatus {
        return this.notificationData.status;
    }

    get label(): string | undefined {
        return this.notificationData.label;
    }

    get createdTime(): string {
        return this.notificationData.createdTime;
    }
}
