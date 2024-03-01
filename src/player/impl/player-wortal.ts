import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import { ConnectedPlayer } from "../classes/connected-player";
import { ConnectedPlayerPayload } from "../interfaces/connected-player-payload";
import { SignedASID } from "../interfaces/facebook-player";
import { SignedPlayerInfo } from "../interfaces/signed-player-info";
import { PlayerBase } from "../player-base";

/**
 * Wortal implementation of the Player API.
 * @hidden
 */
export class PlayerWortal extends PlayerBase {
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

    protected async getDataAsyncImpl(keys: string[]): Promise<any> {
        const local = await this.localStorageGetDataAsyncImpl(keys);
        try {
            const waves = await this.wavesGetDataAsyncImpl(keys);
            if (!local.timestamp || local.timestamp < waves.timestamp) {
                // if local data is 0/NaN or older than waves data, prioritize waves data
                return { ...local.data, ...waves.data };
            } else {
                // if local data is newer than waves data, prioritize local data
                return { ...waves.data, ...local.data };
            }
        } catch (error) {
            // if waves data is not available, return local data
            return local.data;
        }
    }

    protected getSignedASIDAsyncImpl(): Promise<SignedASID> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_SIGNED_ASID_ASYNC, API_URL.PLAYER_GET_SIGNED_ASID_ASYNC));
    }

    protected getSignedPlayerInfoAsyncImpl(): Promise<SignedPlayerInfo> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC, API_URL.PLAYER_GET_SIGNED_PLAYER_INFO_ASYNC));
    }

    protected getTokenAsyncImpl(): Promise<string> {
        return this.defaultGetTokenAsyncImpl();
    }

    protected async setDataAsyncImpl(data: Record<string, unknown>): Promise<void> {
        let result = {
            savedData: data,
            timestamp: Date.now(),
        }
        try {
            result = await this.wavesSetDataAsyncImpl(data);
        } catch (error) { /* empty */ }

        await this.localStorageSetDataAsyncImpl(result.savedData, result.timestamp);
    }

    protected subscribeBotAsyncImpl(): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PLAYER_SUBSCRIBE_BOT_ASYNC, API_URL.PLAYER_SUBSCRIBE_BOT_ASYNC));
    }

}
