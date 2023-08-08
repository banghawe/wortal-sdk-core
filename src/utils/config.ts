import { AdConfig } from "../classes/ads";
import { Player } from "../classes/player";
import { GameState, Session } from "../classes/session";
import { InitializationOptions } from "../interfaces/session";
import { Platform } from "../types/session";

/** @hidden */
export default class SDKConfig {
    // We can't instantiate these in the constructor because that gets called before the Wortal backend script
    // is downloaded. These rely on some functions in that script to initialize, so we delay until Wortal.init
    // to initialize these.
    private _adConfig!: AdConfig;
    private _game!: GameState;
    private _player!: Player;
    private _session!: Session;

    private _isIAPEnabled: boolean = false;
    private _isDebugMode: boolean = false;
    private _isInitialized: boolean = false;

    private _platformSDK: any;

    initialize(options?: InitializationOptions): void {
        if (typeof options !== "undefined") {
            if (typeof options.debugMode !== "undefined") {
                this._isDebugMode = options.debugMode;
            }
        }
        this._session = new Session();
        this._game = new GameState();
        this._isInitialized = true;
    }

    lateInitialize(options?: InitializationOptions): void {
        // We call these late because they sometimes depend on a platform SDK to be initialized already so that we
        // can use the platform's API.
        this._player = new Player().initialize();
        this._adConfig = new AdConfig();
    }

    get adConfig(): AdConfig {
        return this._adConfig;
    }

    get game(): GameState {
        return this._game;
    }

    get player(): Player {
        return this._player;
    }

    get session(): Session {
        return this._session;
    }

    get isIAPEnabled(): boolean {
        return this._isIAPEnabled;
    }

    enableIAP(): void {
        this._isIAPEnabled = true;
    }

    get platformSDK(): any {
        return this._platformSDK;
    }

    set platformSDK(sdk: any) {
        this._platformSDK = sdk;
    }

    get isInitialized(): boolean {
        return this._isInitialized;
    }

    get isDebugMode(): boolean {
        return this._isDebugMode;
    }

    _supportedAPIs: Record<Platform, string[]> = {
        wortal: [
            "ads.showInterstitial",
            "ads.showRewarded",
            "session.getLocale",
            "session.getPlatform",
        ],
        link: [
            "ads.showInterstitial",
            "ads.showRewarded",
            "context.chooseAsync",
            "context.createAsync",
            "context.getId",
            "context.getPlayersAsync",
            "context.getType",
            "context.isSizeBetween",
            "context.shareAsync",
            "context.switchAsync",
            "context.updateAsync",
            "leaderboard.getLeaderboardAsync",
            "leaderboard.sendEntryAsync",
            "leaderboard.getEntriesAsync",
            "leaderboard.getPlayerEntryAsync",
            "leaderboard.getEntryCountAsync",
            "leaderboard.getConnectedPlayerEntriesAsync",
            "player.getID",
            "player.getName",
            "player.getPhoto",
            "player.isFirstPlay",
            "player.getDataAsync",
            "player.setDataAsync",
            "player.getConnectedPlayersAsync",
            "player.getSignedPlayerInfoAsync",
            "player.flushDataAsync",
            "session.getEntryPointData",
            "session.getEntryPointAsync",
            "session.getLocale",
            "session.getPlatform",
            "session.getTrafficSource",
        ],
        viber: [
            "ads.showInterstitial",
            "ads.showRewarded",
            "context.chooseAsync",
            "context.createAsync",
            "context.getId",
            "context.getPlayersAsync",
            "context.getType",
            "context.isSizeBetween",
            "context.shareAsync",
            "context.switchAsync",
            "context.updateAsync",
            "iap.getCatalogAsync",
            "iap.getPurchasesAsync",
            "iap.makePurchaseAsync",
            "iap.consumePurchaseAsync",
            "leaderboard.getLeaderboardAsync",
            "leaderboard.sendEntryAsync",
            "leaderboard.getEntriesAsync",
            "leaderboard.getPlayerEntryAsync",
            "leaderboard.getEntryCountAsync",
            "leaderboard.getConnectedPlayerEntriesAsync",
            "player.getID",
            "player.getName",
            "player.getPhoto",
            "player.isFirstPlay",
            "player.getDataAsync",
            "player.setDataAsync",
            "player.getConnectedPlayersAsync",
            "player.getSignedPlayerInfoAsync",
            "player.flushDataAsync",
            "session.getEntryPointData",
            "session.getEntryPointAsync",
            "session.getLocale",
            "session.getPlatform",
            "session.getTrafficSource",
            "session.setSessionData",
        ],
        gd: [
            "ads.showInterstitial",
            "ads.showRewarded",
            "session.getLocale",
            "session.getPlatform",
        ],
        facebook: [
            "ads.showInterstitial",
            "ads.showRewarded",
            "context.chooseAsync",
            "context.createAsync",
            "context.getId",
            "context.getPlayersAsync",
            "context.getType",
            "context.isSizeBetween",
            "context.shareAsync",
            "context.shareLinkAsync",
            "context.switchAsync",
            "context.updateAsync",
            "iap.getCatalogAsync",
            "iap.getPurchasesAsync",
            "iap.makePurchaseAsync",
            "iap.consumePurchaseAsync",
            "leaderboard.getLeaderboardAsync",
            "leaderboard.sendEntryAsync",
            "leaderboard.getEntriesAsync",
            "leaderboard.getPlayerEntryAsync",
            "leaderboard.getEntryCountAsync",
            "leaderboard.getConnectedPlayerEntriesAsync",
            "notifications.scheduleAsync",
            "notifications.cancelAsync",
            "notifications.cancelAllAsync",
            "notifications.getHistoryAsync",
            "player.getID",
            "player.getName",
            "player.getPhoto",
            "player.getDataAsync",
            "player.setDataAsync",
            "player.getConnectedPlayersAsync",
            "player.getSignedPlayerInfoAsync",
            "player.flushDataAsync",
            "session.getEntryPointData",
            "session.getEntryPointAsync",
            "session.getLocale",
            "session.getPlatform",
            "session.setSessionData",
        ],
        debug: [],
    };
}
