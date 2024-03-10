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

    protected getXsollaUserTokenAsync(): Promise<string> {
        return (Wortal._internalPlatformSDK as CrazyGamesSDK).user.getXsollaUserToken() as Promise<string>;
    }

    protected async getDataAsyncImpl(keys: string[]): Promise<any> {
        const data: Record<string, any> = {};

        try {
            const gameId = Wortal.session._internalSession.gameID;
            const key = `${gameId}-save-data`;

            let stringData = Wortal._internalPlatformSDK.data.getItem(key);
            if (!stringData) {
                stringData = localStorage.getItem(key);
            }

            const dataObj = JSON.parse(stringData);

            keys.forEach((key: string) => {
                data[key] = dataObj[key];
            });
        } catch (error: any) {
            throw new Error(`Error getting saved data: ${error.message}`);
        }

        return data;
    }

    protected async setDataAsyncImpl(data: Record<string, unknown>): Promise<void> {
        try {
            // Save the data to localStorage
            const gameId = Wortal.session._internalSession.gameID;
            const key = `${gameId}-save-data`;
            const jsonData = JSON.stringify(data);
    
            Wortal._internalPlatformSDK.data.setItem(key, jsonData);
            Wortal._log.debug("Saved data to cloud.");
        } catch (error: any) {
            // Handle errors and reject the promise if needed
            throw new Error(`Error saving object to cloud: ${error.message}`);
        }
    }

    protected subscribeBotAsyncImpl(): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_SUBSCRIBE_BOT_ASYNC, API_URL.PLAYER_SUBSCRIBE_BOT_ASYNC));
    }

}
