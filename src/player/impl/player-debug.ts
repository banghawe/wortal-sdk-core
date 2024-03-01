import { ConnectedPlayer } from "../classes/connected-player";
import { ConnectedPlayerPayload } from "../interfaces/connected-player-payload";
import { SignedASID } from "../interfaces/facebook-player";
import { SignedPlayerInfo } from "../interfaces/signed-player-info";
import { PlayerBase } from "../player-base";

/**
 * Debug implementation of the Player API. This is used for testing purposes.
 * @hidden
 */
export class PlayerDebug extends PlayerBase {
    protected canSubscribeBotAsyncImpl(): Promise<boolean> {
        return Promise.resolve(true);
    }

    protected flushDataAsyncImpl(): Promise<void> {
        return Promise.resolve();
    }

    protected getASIDAsyncImpl(): Promise<string> {
        return Promise.resolve(this._player.id);
    }

    protected getConnectedPlayersAsyncImpl(payload?: ConnectedPlayerPayload): Promise<ConnectedPlayer[]> {
        return Promise.resolve([ConnectedPlayer.mock(), ConnectedPlayer.mock(), ConnectedPlayer.mock()]);
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
        return Promise.resolve({
            asid: this._player.id,
            signature: "debug.signature",
        });
    }

    protected getSignedPlayerInfoAsyncImpl(): Promise<SignedPlayerInfo> {
        return Promise.resolve({
            id: this._player.id,
            signature: "debug.signature",
        });
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
        return Promise.resolve();
    }

}
