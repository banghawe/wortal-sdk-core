import { PlacementType } from "../types/ads";

/** @hidden */
export interface AdData {
    placementType?: PlacementType;
    adUnitId: string;
    description: string;
    isValid?: boolean;
}

/** @hidden */
export interface AdCallbacks {
    beforeAd: Function;
    afterAd: Function;
    adDismissed?: Function;
    adViewed?: Function;
    noFill: Function;
    beforeReward?: Function;
    adBreakDone?: Function;
}

/** @hidden */
export interface IAdInstance {
    show: Function;
    logEvent: Function;
}

/** @hidden */
export interface AdInstanceData {
    placementType: PlacementType;
    adUnitId: string;
    description: string;
    beforeAd: Function;
    afterAd: Function;
    adDismissed?: Function;
    adViewed?: Function;
    noFill: Function;
}

/** @hidden */
export interface AdConfigData {
    isAdBlocked: boolean;
    hasPrerollShown: boolean;
    interstitialId: string;
    rewardedId: string;
    adsCalled: number;
    adsShown: number;
}

/** @hidden */
export interface FacebookAdUnitsResponse {
    ads: FacebookAdUnit[];
}

/** @hidden */
export interface FacebookAdUnit {
    display_format: string;
    placement_id: string;
}

/** @hidden */
export interface GDCallbacks {
    [key: string]: Function;
}
