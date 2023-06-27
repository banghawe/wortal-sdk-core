import { NotificationData } from "../types/notification-data";
import { NotificationStatus } from "../types/notification-status";

/**
 * Notification that has been scheduled.
 */
export default class ScheduledNotification {
    private notificationData: NotificationData;

    /** @hidden */
    constructor(data: NotificationData) {
        this.notificationData = data;
    }

    /**
     * Unique ID of the notification.
     */
    get id(): string {
        return this.notificationData.id;
    }

    /**
     * Current status of the notification.
     */
    get status(): NotificationStatus {
        return this.notificationData.status;
    }

    /**
     * Optional label for the notification.
     */
    get label(): string | undefined {
        return this.notificationData.label;
    }

    /**
     * Time the notification was created.
     */
    get createdTime(): string {
        return this.notificationData.createdTime;
    }
}
