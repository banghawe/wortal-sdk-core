import { AdType, PlacementType } from "../types/ads";
import { AnalyticsEventType } from "../types/analytics";
import { Platform } from "../types/session";

/** @hidden */
export interface AnalyticsEventData {
    name: AnalyticsEventType;
    features: object;
}

/** @hidden */
export interface IAnalyticsEvent {
    send: () => void;
}

/** @hidden */
export interface AdCallEventData {
    format: AdType;
    placement?: PlacementType;
    platform: Platform;
    playerID: string;
    gameID: string;
    playTimeAtCall: number;
    success: boolean;
    viewedRewarded?: boolean;
}
