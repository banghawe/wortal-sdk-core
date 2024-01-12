import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported, operationFailed, rethrowError_CrazyGames } from "../../errors/error-handler";
import { Error_CrazyGames } from "../../errors/types/crazygames-error-types";
import Wortal from "../../index";
import { ConnectedPlayer } from "../classes/connected-player";
import { ConnectedPlayerPayload } from "../interfaces/connected-player-payload";
import { SignedASID } from "../interfaces/facebook-player";
import { SignedPlayerInfo } from "../interfaces/signed-player-info";
import { PlayerBase } from "../player-base";
import { fetchSaveData, patchSaveData } from "../../utils/waves-api";
import { CrazyGamesSDK } from "../../core/interfaces/crazygames-sdk";


/**
 * CrazyGames implementation of the Player API.
 * @hidden
 */
export class PlayerCrazyGames extends PlayerBase {
    protected canSubscribeBotAsyncImpl(): Promise<boolean> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC, API_URL.PLAYER_CAN_SUBSCRIBE_BOT_ASYNC));
    }

    protected flushDataAsyncImpl(): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_FLUSH_DATA_ASYNC, API_URL.PLAYER_FLUSH_DATA_ASYNC));
    }

    protected getASIDAsyncImpl(): Promise<string> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_ASID_ASYNC, API_URL.PLAYER_GET_ASID_ASYNC));
    }

    protected getConnectedPlayersAsyncImpl(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer[]> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_CONNECTED_PLAYERS_ASYNC, API_URL.PLAYER_GET_CONNECTED_PLAYERS_ASYNC));
    }

    // protected getDataAsyncImpl(keys: string[]): Promise<any> {
    //     return this.defaultGetDataAsyncImpl(keys);
    // }

    protected getSignedASIDAsyncImpl(): Promise<SignedASID> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC, API_URL.PLAYER_GET_SIGNED_ASID_ASYNC));
    }

    protected getSignedPlayerInfoAsyncImpl(): Promise<SignedPlayerInfo> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC, API_URL.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC));
    }

    protected getTokenAsyncImpl(): Promise<string> {
        return new Promise((resolve, reject) => {
            const callback = (error: Error_CrazyGames, token: string) => {
                if (error) {
                    reject(rethrowError_CrazyGames(error, WORTAL_API.PLAYER_GET_TOKEN_ASYNC, API_URL.PLAYER_GET_TOKEN_ASYNC));
                } else {
                    resolve(token);
                }
            };

            (Wortal._internalPlatformSDK as CrazyGamesSDK).user.getUserToken(callback);
        });
    }

    // protected setDataAsyncImpl(data: Record<string, unknown>): Promise<void> {
    //     return this.defaultSetDataAsyncImpl(data);
    // }

    protected getXsollaUserTokenAsync(): Promise<string> {
        return (Wortal._internalPlatformSDK as CrazyGamesSDK).user.getXsollaUserToken() as Promise<string>;
    }

    protected async getDataAsyncImpl(keys: string[]): Promise<any> {
        try {
            let dataObj: Record<string, any> = {};

            // getting localStorage save data along with the timestamp
            const data = localStorage.getItem(`${Wortal.session._internalSession.gameID}-save-data`);
            const timestamp = Number(localStorage.getItem(`${Wortal.session._internalSession.gameID}-save-data-timestamp`));
            if (data) {
                try {
                    const localSaveData = JSON.parse(data);
                    if (localSaveData) {
                        dataObj = {...dataObj, ...localSaveData};
                    }
                } catch (error: any) {
                    Wortal._log.exception(`Error loading object from localStorage: ${error.message}`);
                }
            }

            // if Xsolla is enabled, we try to fetch the data from waves
            if (Wortal._internalIsXsollaEnabled) {
                try {
                    const token = await this.getXsollaUserTokenAsync();
                    if (token) {
                        const wavesData = await fetchSaveData<Record<string, any>>(token, Number(Wortal.session._internalSession.gameID));
                        if (wavesData.timestamp >= timestamp) {
                            // if the data is newer than the local data, we update the local data
                            dataObj = {...dataObj, ...wavesData.save_data};
                            localStorage.setItem(`${Wortal.session._internalSession.gameID}-save-data`, JSON.stringify(dataObj));
                        }
                    }
                } catch (error: any) {
                    Wortal._log.exception("Error while fetching save data from waves.", error);
                }
            }

            // The API allows the developer to request only a subset of the data, so we filter the result here.
            const result: Record<string, any> = {};
            keys.forEach((key: string) => {
                result[key] = dataObj[key];
            });

            return result;
        } catch (error: any) {
            throw operationFailed(`Error saving object to localStorage: ${error.message}`,
                WORTAL_API.PLAYER_GET_DATA_ASYNC, API_URL.PLAYER_GET_DATA_ASYNC);
        }
    }

    protected async setDataAsyncImpl(data: Record<string, unknown>): Promise<void> {
        let timestamp = Date.now();
        let savedData = data;

        // if Xsolla is enabled, we try to save the data to waves
        if (Wortal._internalIsXsollaEnabled) {
            try {
                const token = await this.getXsollaUserTokenAsync();
                if (token) {
                    const wavesData = await patchSaveData<Record<string, any>>(token, Number(Wortal.session._internalSession.gameID), data);
                    savedData = wavesData.save_data;
                    // we update the timestamp to use the timestamp values from waves server
                    timestamp = wavesData.timestamp;
                    Wortal._log.debug("Saved data to waves.");
                }
            } catch (error: any) {
                Wortal._log.exception("Error while saving data to waves.", error);
            }
        }

        try {
            // save the data to localStorage
            localStorage.setItem(`${Wortal.session._internalSession.gameID}-save-data`, JSON.stringify(savedData));
            localStorage.setItem(`${Wortal.session._internalSession.gameID}-save-data-timestamp`, JSON.stringify(timestamp));
            Wortal._log.debug("Saved data to localStorage.");
        } catch (error: any) {
            //TODO: do we need to reject here?
            throw operationFailed(`Error saving object to localStorage: ${error.message}`,
                WORTAL_API.PLAYER_SET_DATA_ASYNC, API_URL.PLAYER_SET_DATA_ASYNC);
        }
    }

    protected subscribeBotAsyncImpl(): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_SUBSCRIBE_BOT_ASYNC, API_URL.PLAYER_SUBSCRIBE_BOT_ASYNC));
    }

}
