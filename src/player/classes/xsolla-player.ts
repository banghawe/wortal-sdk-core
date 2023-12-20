import type { XsollaPayload } from "../../auth/xsolla";
import { Player } from "./player";
import Wortal from "../../index";
import { getXsollaToken, parseXsollaToken } from "../../auth/xsolla";
import { generateRandomID } from "../../utils/wortal-utils";

/**
 * Represents a CrazyGames player.
 * @hidden
 */
export class XsollaPlayer extends Player {
    constructor(player?: XsollaPayload) {
        super();

        if (player) {
            this._data.id = player.sub || generateRandomID();
            this._data.name = player.username || "Player";
            this._data.photo = player.picture || "https://images.crazygames.com/userportal/avatars/4.png";
        }
    }

    public override async initialize(): Promise<void> {
        const xsollaToken = getXsollaToken();
        if (xsollaToken) {
            const parsedToken = parseXsollaToken(xsollaToken);
            this._data.id = parsedToken.sub;
            this._data.name = parsedToken.name;
            this._data.photo = parsedToken.picture;
        }

        Wortal._log.debug("Player initialized: ", this._data);
        return Promise.resolve();
    }
}
