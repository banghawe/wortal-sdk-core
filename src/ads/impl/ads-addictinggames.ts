import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import Wortal from "../../index";
import { AdsBase } from "../ads-base";
import { AdConfig } from "../classes/ad-config";
import { AdConfigNull } from "../classes/ad-config-null";
import { AdInstanceData } from "../interfaces/ad-data";
import { BannerPosition } from "../types/banner-position";

/**
 * AddictingGames implementation of the Ads API.
 */
export class AdsAddictingGames extends AdsBase {
    protected _adConfig: AdConfig;

    constructor() {
        super();
        this._adConfig = new AdConfigNull();
    }

    protected showBannerImpl(shouldShow: boolean, position: BannerPosition): void {
        throw notSupported(undefined, WORTAL_API.ADS_SHOW_BANNER, API_URL.ADS_SHOW_BANNER);
    }

    protected showInterstitialImpl(ad: AdInstanceData): void {
        ad.callbacks.beforeAd();
        Wortal._internalPlatformSDK.showAd()
            .then(() => {
                ad.callbacks.afterAd();
                this.logAdCall("interstitial", ad.placementType, true);
            })
            .catch(() => {
                ad.callbacks.noFill();
                this.logAdCall("interstitial", ad.placementType, false);
            });
    }

    protected showRewardedImpl(ad: AdInstanceData): void {
        // Trigger the callbacks so the game doesn't get stuck waiting indefinitely.
        ad.callbacks.adDismissed?.();
        ad.callbacks.noFill();
        throw notSupported(undefined, WORTAL_API.ADS_SHOW_REWARDED, API_URL.ADS_SHOW_REWARDED);
    }
}
