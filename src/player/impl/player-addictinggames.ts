import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported, rethrowError_AddictingGames } from "../../errors/error-handler";
import { ErrorMessage_AddictingGames } from "../../errors/interfaces/addictinggames-error";
import Wortal from "../../index";
import { ConnectedPlayer } from "../classes/connected-player";
import { ConnectedPlayerPayload } from "../interfaces/connected-player-payload";
import { SignedASID } from "../interfaces/facebook-player";
import { SignedPlayerInfo } from "../interfaces/signed-player-info";
import { PlayerBase } from "../player-base";

/**
 * AddictingGames implementation of Player API.
 * @hidden
 */
export class PlayerAddictingGames extends PlayerBase {
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

    protected getDataAsyncImpl(keys: string[]): Promise<any> {
        return Wortal._internalPlatformSDK.getUserDatastore()
            .then((data: any) => {
                const savedData = data.find((item: { key: string; }) => item.key === 'userData');

                if (savedData && savedData.value) {
                    try {
                        return JSON.parse(savedData.value);
                    } catch (error: any) {
                        Wortal._log.exception(`Error loading object from cloud: ${error.message}`);
                    }
                }
            })
            .catch((error: ErrorMessage_AddictingGames) => {
                throw rethrowError_AddictingGames(error, WORTAL_API.PLAYER_GET_DATA_ASYNC, API_URL.PLAYER_GET_DATA_ASYNC);
            });
    }

    protected getSignedASIDAsyncImpl(): Promise<SignedASID> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC, API_URL.PLAYER_GET_SIGNED_ASID_ASYNC));
    }

    protected getSignedPlayerInfoAsyncImpl(): Promise<SignedPlayerInfo> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC, API_URL.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC));
    }

    protected getTokenAsyncImpl(): Promise<string> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_TOKEN_ASYNC, API_URL.PLAYER_GET_TOKEN_ASYNC));
    }

    protected setDataAsyncImpl(data: Record<string, unknown>): Promise<void> {
        return Wortal._internalPlatformSDK.postDatastore("userData", JSON.stringify(data))
            .then(() => {
                Wortal._log.debug("Saved data to cloud storage.");
            })
            .catch((error: ErrorMessage_AddictingGames) => {
                throw rethrowError_AddictingGames(error, WORTAL_API.PLAYER_SET_DATA_ASYNC, API_URL.PLAYER_SET_DATA_ASYNC);
            });
    }

    protected subscribeBotAsyncImpl(): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_SUBSCRIBE_BOT_ASYNC, API_URL.PLAYER_SUBSCRIBE_BOT_ASYNC));
    }

}
