import { API_URL, WORTAL_API } from "../data/core-data";
import { implementationError, invalidParams, notSupported, notInitialized, operationFailed } from "../errors/error-handler";
import { ValidationResult } from "../errors/interfaces/validation-result";
import Wortal from "../index";
import { ConnectedPlayer } from "./classes/connected-player";
import { Player } from "./classes/player";
import { ConnectedPlayerPayload } from "./interfaces/connected-player-payload";
import { SignedASID } from "./interfaces/facebook-player";
import { SignedPlayerInfo } from "./interfaces/signed-player-info";
import { fetchSaveData, patchSaveData } from "../utils/waves-api";
import { getXsollaToken } from "../auth/xsolla";
import { XsollaPlayer } from "./classes/xsolla-player";

/**
 * Base class for the Player API. Extend this class to implement the Player API for a specific platform.
 * @hidden
 */
export class PlayerBase {
    protected _player: Player;

    constructor(player: Player) {
        this._player = player;
    }

    /** @hidden */
    get _internalPlayer(): Player {
        return this._player;
    }

    /** @hidden */
    set _internalPlayer(value: Player) {
        this._player = value;
    }

//#region Public API

    public canSubscribeBotAsync(): Promise<boolean> {
        Wortal._log.apiCall(WORTAL_API.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC);

        const validationResult: ValidationResult = this.validateCanSubscribeBotAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.canSubscribeBotAsyncImpl();
    }

    public flushDataAsync(): Promise<void> {
        Wortal._log.apiCall(WORTAL_API.PLAYER_FLUSH_DATA_ASYNC);

        const validationResult: ValidationResult = this.validateFlushDataAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.flushDataAsyncImpl();
    }

    public getASIDAsync(): Promise<string> {
        Wortal._log.apiCall(WORTAL_API.PLAYER_GET_ASID_ASYNC);

        // We don't validate this call because it's called from the SDK itself during Player initialization on FB.
        // We need the ASID to fetch the ad unit IDs from the Wortal API, so we can't have this fail.

        return this.getASIDAsyncImpl();
    }

    public getConnectedPlayersAsync(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer[]> {
        Wortal._log.apiCall(WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC);

        const validationResult: ValidationResult = this.validateGetConnectedPlayersAsync(payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getConnectedPlayersAsyncImpl(payload);
    }

    public getDataAsync(keys: string[]): Promise<any> {
        Wortal._log.apiCall(WORTAL_API.PLAYER_GET_DATA_ASYNC);

        const validationResult: ValidationResult = this.validateGetDataAsync(keys);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getDataAsyncImpl(keys);
    }

    public getID(): string | null {
        Wortal._log.apiCall(WORTAL_API.PLAYER_GET_ID);

        const validationResult: ValidationResult = this.validateGetID();
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this._player.id;
    }

    public getName(): string | null {
        Wortal._log.apiCall(WORTAL_API.PLAYER_GET_NAME);

        const validationResult: ValidationResult = this.validateGetName();
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this._player.name;
    }

    public getPhoto(): string | null {
        Wortal._log.apiCall(WORTAL_API.PLAYER_GET_PHOTO);

        const validationResult: ValidationResult = this.validateGetPhoto();
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this._player.photo;
    }

    public getSignedASIDAsync(): Promise<SignedASID> {
        Wortal._log.apiCall(WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC);

        const validationResult: ValidationResult = this.validateGetSignedASIDAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getSignedASIDAsyncImpl();
    }

    public getSignedPlayerInfoAsync(): Promise<SignedPlayerInfo> {
        Wortal._log.apiCall(WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC);

        const validationResult: ValidationResult = this.validateGetSignedPlayerInfoAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getSignedPlayerInfoAsyncImpl();
    }

    public getTokenAsync(): Promise<string> {
        Wortal._log.apiCall(WORTAL_API.PLAYER_GET_TOKEN_ASYNC);

        const validationResult: ValidationResult = this.validateGetTokenAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getTokenAsyncImpl();
    }

    public isFirstPlay(): boolean {
        Wortal._log.apiCall(WORTAL_API.PLAYER_IS_FIRST_PLAY);

        const validationResult: ValidationResult = this.validateIsFirstPlay();
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        return this._player.isFirstPlay
    }

    public onLogin(callback: () => void): void {
        Wortal._log.apiCall(WORTAL_API.PLAYER_ON_LOGIN);

        const validationResult: ValidationResult = this.validateOnLogin(callback);
        if (!validationResult.valid) {
            throw validationResult.error;
        }

        //TODO: implement onLogin
        /*
        if (platform === "crazygames") {
            config.platformSDK.user.addAuthListener(callback);
        }
         */
    }

    public setDataAsync(data: Record<string, unknown>): Promise<void> {
        Wortal._log.apiCall(WORTAL_API.PLAYER_SET_DATA_ASYNC);

        const validationResult: ValidationResult = this.validateSetDataAsync(data);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.setDataAsyncImpl(data);
    }

    public subscribeBotAsync(): Promise<void> {
        Wortal._log.apiCall(WORTAL_API.PLAYER_SUBSCRIBE_BOT_ASYNC);

        const validationResult: ValidationResult = this.validateSubscribeBotAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.subscribeBotAsyncImpl();
    }

//#endregion
//#region Implementation interface

    protected canSubscribeBotAsyncImpl(): Promise<boolean> { throw implementationError(); };
    protected flushDataAsyncImpl(): Promise<void> { throw implementationError(); };
    protected getASIDAsyncImpl(): Promise<string> { throw implementationError(); };
    protected getConnectedPlayersAsyncImpl(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer[]> { throw implementationError(); };
    protected getDataAsyncImpl(keys: string[]): Promise<any> { throw implementationError(); };
    protected getSignedASIDAsyncImpl(): Promise<SignedASID> { throw implementationError(); };
    protected getSignedPlayerInfoAsyncImpl(): Promise<SignedPlayerInfo> { throw implementationError(); };
    protected getTokenAsyncImpl(): Promise<string> { throw implementationError(); };
    protected setDataAsyncImpl(data: Record<string, unknown>): Promise<void> { throw implementationError(); };
    protected subscribeBotAsyncImpl(): Promise<void> { throw implementationError(); };

    protected async defaultGetDataAsyncImpl(keys: string[]): Promise<any> {
        // default implementation is using localStorage
        try {
            const local = await this.localStorageGetDataAsyncImpl(keys);
            return local.data;
        } catch (error: any) {
            throw operationFailed(`Error loading data from localStorage: ${error.message}`,
                WORTAL_API.PLAYER_GET_DATA_ASYNC, API_URL.PLAYER_GET_DATA_ASYNC);
        }
    }

    /**
     * Gets the save data from localStorage.
     * @param keys the keys to filter the data from localStorage
     * @returns a promise with data and timestamp
     */
    protected async localStorageGetDataAsyncImpl(keys: string[]): Promise<{ data: Record<string, any>, timestamp: number }> {
        const data: Record<string, any> = {};

        // getting localStorage save data along with the timestamp
        const savedDataJson = localStorage.getItem(`${Wortal.session._internalSession.gameID}-save-data`);
        const timestamp = Number(localStorage.getItem(`${Wortal.session._internalSession.gameID}-save-data-timestamp`));
        if (savedDataJson) {
            try {
                const dataObj = JSON.parse(savedDataJson);

                // The API allows the developer to request only a subset of the data, so we filter the result here.
                keys.forEach((key: string) => {
                    data[key] = dataObj[key];
                });

            } catch (error: any) {
                Wortal._log.exception(`Error loading object from localStorage: ${error.message}`);
            }
        }
        return { data, timestamp };
    }

    /**
     * To validate the player is authenticated and has a token.
     * @param throwException if true, throws an exception if the token is not available
     * @returns the token if available, empty string otherwise
     */
    protected validateWavesToken(throwException: boolean = true): string {
        // check if _player is an XsollaPlayer instance
        if (!this._player || !(this._player instanceof XsollaPlayer)) {
            if (!throwException) {
                return "";
            }
            throw notSupported(
                `Error saving object to waves: player is not an XsollaPlayer instance.`,
                WORTAL_API.PLAYER_SET_DATA_ASYNC, API_URL.PLAYER_SET_DATA_ASYNC);
        }
        // check if this player is authenticated
        if (!this._player.isAuthenticated) {
            if (!throwException) {
                return "";
            }
            throw notSupported(
                `Error saving object to waves: player is not authenticated.`,
                WORTAL_API.PLAYER_SET_DATA_ASYNC, API_URL.PLAYER_SET_DATA_ASYNC);
        }
        const token = getXsollaToken();
        if (!token) {
            if (!throwException) {
                return "";
            }
            throw notSupported(
                `Error saving object to waves: cannot get player's token.`,
                WORTAL_API.PLAYER_SET_DATA_ASYNC, API_URL.PLAYER_SET_DATA_ASYNC);
        }
        return token;
    }

    /**
     * Gets the save data from waves.
     * @param keys the keys to filter the data from waves
     * @returns a promise with data and timestamp
     */
    protected async wavesGetDataAsyncImpl(keys: string[]): Promise<{ data: Record<string, any>, timestamp: number }> {
        const token = this.validateWavesToken();
        const data: Record<string, any> = {};
        try {

            const { save_data, timestamp } = await fetchSaveData<Record<string, any>>(token, Number(Wortal.session._internalSession.gameID));

            keys.forEach((key: string) => {
                data[key] = save_data[key];
            });

            return { data, timestamp };
        } catch (error: any) {
            Wortal._log.exception("Error while fetching save data from waves.", error);
            throw error;
        }
    }

    protected async defaultSetDataAsyncImpl(data: Record<string, unknown>): Promise<void> {
        // default implementation is using localStorage
        await this.localStorageSetDataAsyncImpl(data, Date.now());
    }

    /**
     * To save the game data to the localStorage
     * @param data the data to save to localStorage
     * @param timestamp the timestamp to saved along with the data
     */
    protected async localStorageSetDataAsyncImpl(data: Record<string, unknown>, timestamp: number): Promise<void> {
        try {
            // save the data to localStorage
            localStorage.setItem(`${Wortal.session._internalSession.gameID}-save-data`, JSON.stringify(data));
            localStorage.setItem(`${Wortal.session._internalSession.gameID}-save-data-timestamp`, JSON.stringify(timestamp));
            Wortal._log.debug("Saved data to localStorage.");
        } catch (error: any) {
            //TODO: do we need to reject here?
            throw operationFailed(`Error saving object to localStorage: ${error.message}`,
                WORTAL_API.PLAYER_SET_DATA_ASYNC, API_URL.PLAYER_SET_DATA_ASYNC);
        }
    }

    /**
     * To save the game data to the waves server
     * @param data the data to save to waves
     * @returns a Promise with savedData and timestamp
     */
    protected async wavesSetDataAsyncImpl(data: Record<string, unknown>): Promise<{
        savedData: Record<string, any>,
        timestamp: number,
    }> {
        const token = this.validateWavesToken();
        try {
            const wavesData = await patchSaveData<Record<string, any>>(token, Number(Wortal.session._internalSession.gameID), data);
            const savedData = wavesData.save_data as Record<string, any>;
            // we update the timestamp to use the timestamp values from waves server
            const timestamp = wavesData.timestamp as number;
            Wortal._log.debug("Saved data to waves.");
            return { savedData, timestamp };
        } catch (error: any) {
            Wortal._log.exception("Error while saving data to waves.", error);
            throw operationFailed(
                "Error while saving data to waves.",
                WORTAL_API.PLAYER_SET_DATA_ASYNC, API_URL.PLAYER_SET_DATA_ASYNC);
        }
    }

    protected defaultGetTokenAsyncImpl(): Promise<string> {
        const xsollaToken = getXsollaToken();
        if (xsollaToken) {
            return Promise.resolve(xsollaToken);
        }
        return Promise.resolve("");
    }

//#endregion
//#region Validation

    protected validateCanSubscribeBotAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC,
                    API_URL.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC),
            };
        }

        return {valid: true};
    }

    protected validateFlushDataAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_FLUSH_DATA_ASYNC,
                    API_URL.PLAYER_FLUSH_DATA_ASYNC),
            };
        }

        return {valid: true};
    }

    protected validateGetConnectedPlayersAsync(payload?: ConnectedPlayerPayload): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC,
                    API_URL.PLAYER_GET_CONNECTED_PLAYERS_ASYNC),
            };
        }

        return {valid: true};
    }

    protected validateGetDataAsync(keys: string[]): ValidationResult {
        if (!Array.isArray(keys) || !keys.length) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.PLAYER_GET_DATA_ASYNC,
                    API_URL.PLAYER_GET_DATA_ASYNC),
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_GET_DATA_ASYNC,
                    API_URL.PLAYER_GET_DATA_ASYNC),
            };
        }

        return {valid: true};
    }

    protected validateGetID(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_GET_ID,
                    API_URL.PLAYER_GET_ID),
            };
        }

        return {valid: true};
    }

    protected validateGetName(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_GET_NAME,
                    API_URL.PLAYER_GET_NAME),
            };
        }

        return {valid: true};
    }

    protected validateGetPhoto(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_GET_PHOTO,
                    API_URL.PLAYER_GET_PHOTO),
            };
        }

        return {valid: true};
    }

    protected validateGetSignedASIDAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC,
                    API_URL.PLAYER_GET_SIGNED_ASID_ASYNC),
            };
        }

        return {valid: true};
    }

    protected validateGetSignedPlayerInfoAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC,
                    API_URL.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC),
            };
        }

        return {valid: true};
    }

    protected validateGetTokenAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_GET_TOKEN_ASYNC,
                    API_URL.PLAYER_GET_TOKEN_ASYNC),
            };
        }

        return {valid: true};
    }

    protected validateIsFirstPlay(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_IS_FIRST_PLAY,
                    API_URL.PLAYER_IS_FIRST_PLAY),
            };
        }

        return {valid: true};
    }

    protected validateOnLogin(callback: () => void): ValidationResult {
        if (typeof callback !== "function") {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.PLAYER_ON_LOGIN,
                    API_URL.PLAYER_ON_LOGIN),
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_ON_LOGIN,
                    API_URL.PLAYER_ON_LOGIN),
            };
        }

        return {valid: true};
    }

    protected validateSetDataAsync(data: Record<string, unknown>): ValidationResult {
        if (typeof data !== "object") {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.PLAYER_SET_DATA_ASYNC,
                    API_URL.PLAYER_SET_DATA_ASYNC),
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_SET_DATA_ASYNC,
                    API_URL.PLAYER_SET_DATA_ASYNC),
            };
        }

        return {valid: true};
    }

    protected validateSubscribeBotAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.PLAYER_SUBSCRIBE_BOT_ASYNC,
                    API_URL.PLAYER_SUBSCRIBE_BOT_ASYNC),
            };
        }

        return {valid: true};
    }

//#endregion
}
