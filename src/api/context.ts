import ConnectedPlayer from "../models/connected-player";
import { ContextSizeResponse, ContextType } from "../types/context";
import { ChoosePayload, LinkSharePayload, SharePayload, UpdatePayload } from "../types/payloads";
import { PlayerData } from "../types/player";
import {
    convertToFBInstantSharePayload,
    convertToFBInstantUpdatePayload,
    convertToLinkMessagePayload,
} from "../utils/converters";
import { invalidParams, notSupported, rethrowPlatformError } from "../utils/error-handler";
import { isValidPayloadImage, isValidPayloadText, isValidString } from "../utils/validators";
import { config } from "./index";

/**
 * Gets the ID of the current context.
 * @example
 * let id = Wortal.context.getId();
 * console.log(id);
 * @returns {string | null} String ID of the current context if one exists. Null if the player is playing solo or
 * if the game is being played on a platform that does not currently support context.
 */
export function getId(): string | null {
    const platform = config.session.platform;
    if (platform === "link" || platform === "viber" || platform === "facebook") {
        return (window as any).wortalGame.context.getID();
    } else {
        return null;
    }
}

/**
 * Gets the type of the current context.
 * @example
 * let type = Wortal.context.getType();
 * console.log(type);
 * @returns {ContextType} The type of the current context. Possible values:
 * <ul>
 * <li>SOLO - Default</li>
 * <li>THREAD</li>
 * <li>GROUP - Facebook only</li>
 * <li>POST - Facebook only</li>
 * </ul>
 */
export function getType(): ContextType {
    const platform = config.session.platform;
    if (platform === "link" || platform === "viber" || platform === "facebook") {
        return (window as any).wortalGame.context.getType();
    } else {
        return "SOLO";
    }
}

/**
 * Gets an array of ConnectedPlayer objects containing information about active players in the current context
 * (people who played the game in the current context in the last 90 days). This may include the current player.
 * @example
 * Wortal.context.getPlayersAsync()
 *  .then(players => {
 *    console.log(players.length);
 *    console.log(players[0].id);
 *    console.log(players[0].name);
 *    });
 * @returns {Promise<ConnectedPlayer[]>} Array of players in the current context.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>NETWORK_FAILURE</li>
 * <li>CLIENT_UNSUPPORTED_OPERATION</li>
 * <li>INVALID_OPERATION</li>
 * </ul>
 */
export function getPlayersAsync(): Promise<ConnectedPlayer[]> {
    const platform = config.session.platform;
    if (platform === "wortal" || platform === "gd") {
        throw notSupported(`context.getPlayersAsync not currently supported on platform: ${platform}`, "context.getPlayersAsync");
    }

    return Promise.resolve().then(() => {
        return (window as any).wortalGame.context.getPlayersAsync()
            .then((players: any) => {
                return players.map((player: any) => {
                    let playerData: PlayerData = {
                        id: player.getID(),
                        name: player.getName(),
                        photo: player.getPhoto(),
                        // Facebook's player model doesn't have the hasPlayed flag.
                        isFirstPlay: platform === "facebook" ? false : !player.hasPlayed,
                        daysSinceFirstPlay: 0,
                    };
                    return new ConnectedPlayer(playerData);
                });
            })
            .catch((e: any) => {
                throw rethrowPlatformError(e, "context.getPlayersAsync");
            });
    });
}

/**
 * This invokes a dialog to let the user share specified content, as a post on the user's timeline, for example.
 * A blob of data can be attached to the share which every game session launched from the share will be able to access
 * from Wortal.session.getEntryPointData(). This data must be less than or equal to 1000 characters when stringified.
 * The user may choose to cancel the share action and close the dialog, and the returned promise will resolve when the
 * dialog is closed regardless if the user actually shared the content or not.
 * @example
 * Wortal.context.shareAsync({
 *     image: 'data:base64Image',
 *     text: 'Share text',
 *     cta: 'Play',
 *     data: { exampleData: 'yourData' },
 * }).then(result => console.log(result)); // Contains shareCount with number of friends the share was sent to.
 * @param {SharePayload} payload Object defining the share message.
 * @returns {Promise<number>} Number of friends the message was shared with. Facebook will always return 0.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>NETWORK_FAILURE</li>
 * <li>PENDING_REQUEST</li>
 * <li>CLIENT_UNSUPPORTED_OPERATION</li>
 * <li>INVALID_OPERATION</li>
 * </ul>
 */
export function shareAsync(payload: SharePayload): Promise<number> {
    const platform = config.session.platform;
    if (platform === "wortal" || platform === "gd") {
        throw notSupported(`context.shareAsync not currently supported on platform: ${platform}`, "context.shareAsync");
    }
    if (!isValidPayloadText(payload.text)) {
        throw invalidParams("Text cannot be null or empty.", "context.shareAsync");
    }
    if (!isValidPayloadImage(payload.image)) {
        throw invalidParams("Image needs to be a data URL for a base64 encoded image.", "context.shareAsync");
    }

    return Promise.resolve().then(() => {
        let convertedPayload: any = payload;
        if (platform === "link") {
            convertedPayload = convertToLinkMessagePayload(payload);
        } else if (platform === "facebook") {
            convertedPayload = convertToFBInstantSharePayload(payload);
        }

        return (window as any).wortalGame.shareAsync(convertedPayload)
            .then((result: any) => {
                if (typeof result === "undefined") {
                    return 0;
                } else {
                    return result.sharedCount;
                }
            })
            .catch((e: any) => {
                throw rethrowPlatformError(e, "context.shareAsync");
            });
    });
}

/**
 * This invokes a dialog that contains a custom game link that users can copy to their clipboard, or share.
 * A blob of data can be attached to the custom link - game sessions initiated from the link will be able to access the
 * data through Wortal.session.getEntryPointData(). This data should be less than or equal to 1000 characters when
 * stringified. The provided text and image will be used to generate the link preview, with the game name as the title
 * of the preview. The text is recommended to be less than 44 characters. The image is recommended to either be a square
 * or of the aspect ratio 1.91:1. The returned promise will resolve when the dialog is closed regardless if the user
 * actually shared the link or not.
 * @example
 * Wortal.context.shareLinkAsync({
 *    image: 'data:base64Image',
 *    text: 'Share text',
 *    data: { exampleData: 'yourData' },
 * })
 * .then(() => resumeGame);
 * @param payload Object defining the payload for the custom link.
 * @returns {Promise<void>} Promise that resolves when the dialog is closed.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>NETWORK_FAILURE</li>
 * <li>PENDING_REQUEST</li>
 * <li>INVALID_OPERATION</li>
 * </ul>
 */
export function shareLinkAsync(payload: LinkSharePayload): Promise<void> {
    const platform = config.session.platform;
    if (platform !== "facebook") {
        throw notSupported(`context.shareLinkAsync not currently supported on platform: ${platform}`, "context.shareLinkAsync");
    }
    if (typeof payload.data === "undefined") {
        throw invalidParams("Data cannot be null or empty.", "context.shareLinkAsync");
    }

    return Promise.resolve().then(() => {
        return (window as any).wortalGame.shareLinkAsync(payload)
            .catch((e: any) => {
                throw rethrowPlatformError(e, "context.shareLinkAsync");
            });
    });
}

/**
 * Posts an update to the current context. Will send a message to the chat thread of the current context.
 * When players launch the game from this message, those game sessions will be able to access the specified blob
 * of data through Wortal.session.getEntryPointData().
 * @example
 * Wortal.context.updateAsync({
 *     image: 'data:base64Image',
 *     text: 'Update text',
 *     cta: 'Play',
 *     data: { exampleData: 'yourData' },
 * });
 * @param {UpdatePayload} payload Object defining the update message.
 * @returns {Promise<void>} Promise that resolves when the update is sent.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>PENDING_REQUEST</li>
 * <li>INVALID_OPERATION</li>
 * </ul>
 */
export function updateAsync(payload: UpdatePayload): Promise<void> {
    const platform = config.session.platform;
    if (platform === "wortal" || platform === "gd") {
        throw notSupported(`context.updateAsync not currently supported on platform: ${platform}`, "context.updateAsync");
    }
    if (!isValidPayloadText(payload.text)) {
        throw invalidParams("Text cannot be null or empty.", "context.updateAsync");
    }
    if (!isValidPayloadImage(payload.image)) {
        throw invalidParams("Image needs to be a data URL for a base64 encoded image.", "context.updateAsync");
    }

    return Promise.resolve().then(() => {
        let convertedPayload: any = payload;
        if (platform === "link") {
            convertedPayload = convertToLinkMessagePayload(payload);
        } else if (platform === "facebook") {
            convertedPayload = convertToFBInstantUpdatePayload(payload);
        }

        return (window as any).wortalGame.updateAsync(convertedPayload)
            .catch((e: any) => {
                throw rethrowPlatformError(e, "context.updateAsync");
            });
    });
}

/**
 * Opens a context selection dialog for the player. If the player selects an available context, the client will attempt
 * to switch into that context, and resolve if successful. Otherwise, if the player exits the menu or the client fails
 * to switch into the new context, this function will reject.
 * @example
 * Wortal.context.chooseAsync()
 *  .then(console.log(Wortal.context.getId()));
 * @param {ChoosePayload} payload Object defining the options for the context choice.
 * @returns {Promise<void>} A promise that resolves with an array of player IDs of the players that were invited.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>SAME_CONTEXT</li>
 * <li>NETWORK_FAILURE</li>
 * <li>USER_INPUT</li>
 * <li>PENDING_REQUEST</li>
 * <li>CLIENT_UNSUPPORTED_OPERATION</li>
 * </ul>
 */
export function chooseAsync(payload?: ChoosePayload): Promise<void> {
    const platform = config.session.platform;
    if (platform === "wortal" || platform === "gd") {
        throw notSupported(`context.chooseAsync not currently supported on platform: ${platform}`, "context.chooseAsync");
    }

    return Promise.resolve().then(() => {
        if (typeof payload === "undefined" || platform === "link") {
            return (window as any).wortalGame.context.chooseAsync()
                .catch((e: any) => {
                    throw rethrowPlatformError(e, "context.chooseAsync");
                });
        } else {
            return (window as any).wortalGame.context.chooseAsync(payload)
                .catch((e: any) => {
                    throw rethrowPlatformError(e, "context.chooseAsync");
                });
        }
    });
}

/**
 * Request a switch into a specific context. If the player does not have permission to enter that context, or if the
 * player does not provide permission for the game to enter that context, this will reject. Otherwise, the promise will
 * resolve when the game has switched into the specified context.
 * @example
 * Wortal.context.switchAsync('abc123');
 * @param contextId ID of the desired context or the string SOLO to switch into a solo context.
 * @returns {Promise<void>} A promise that resolves when the game has switched into the specified context, or rejects otherwise.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>SAME_CONTEXT</li>
 * <li>NETWORK_FAILURE</li>
 * <li>USER_INPUT</li>
 * <li>PENDING_REQUEST</li>
 * <li>CLIENT_UNSUPPORTED_OPERATION</li>
 * </ul>
 */
export function switchAsync(contextId: string): Promise<void> {
    //TODO: add switchSilentlyIfSolo param if necessary
    const platform = config.session.platform;
    if (platform === "wortal" || platform === "gd") {
        throw notSupported(`context.switchAsync not currently supported on platform: ${platform}`, "context.switchAsync");
    }
    if (!isValidString(contextId)) {
        throw invalidParams("contextId cannot be null or empty.", "context.switchAsync");
    }

    return Promise.resolve().then(() => {
        return (window as any).wortalGame.context.switchAsync(contextId)
            .catch((e: any) => {
                throw rethrowPlatformError(e, "context.switchAsync");
            });
    });
}

/**
 * <p>Attempts to create a context between the current player and a specified player or a list of players. This API
 * supports 3 use cases: 1) When the input is a single playerID, it attempts to create or switch into a context between
 * a specified player and the current player 2) When the input is a list of connected playerIDs, it attempts to create
 * a context containing all the players 3) When there's no input, a friend picker will be loaded to ask the player to
 * create a context with friends to play with.</p>
 * <p>For each of these cases, the returned promise will reject if any of the players listed are not Connected Players
 * of the current player, or if the player denies the request to enter the new context. Otherwise, the promise will
 * resolve when the game has switched into the new context.</p>
 * @example
 * Wortal.context.createAsync('player123');
 * @param playerId ID of player to create a context with, or a list of player IDs to create a context with. If not
 * specified, a friend picker will be loaded to ask the player to create a context with friends to play with. Link
 * and Viber will only accept a single, required player ID. If no ID is passed on these platforms the call will fail.
 * If an array of IDs is passed on these platforms, the call will be made with the first ID in the array.
 * @returns {Promise<void>} A promise that resolves when the game has switched into the new context, or rejects otherwise.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>SAME_CONTEXT</li>
 * <li>NETWORK_FAILURE</li>
 * <li>USER_INPUT</li>
 * <li>PENDING_REQUEST</li>
 * <li>CLIENT_UNSUPPORTED_OPERATION</li>
 * </ul>
 */
export function createAsync(playerId?: string | string[]): Promise<void> {
    const platform = config.session.platform;
    if (platform === "wortal" || platform === "gd") {
        throw notSupported(`context.createAsync not currently supported on platform: ${platform}`, "context.createAsync");
    }
    // Link & Viber only support creating a context with a single player, and we must pass in a player ID.
    // Facebook supports creating a context with a single player, list of players, or no player (to open a friend picker).
    if (platform === "link" || platform === "viber") {
        if (Array.isArray(playerId)) {
            playerId = playerId[0];
        }
    }
    if (platform !== "facebook" && !isValidString(playerId)) {
        throw invalidParams("playerId cannot be null or empty.", "context.createAsync");
    }

    return Promise.resolve().then(() => {
        return (window as any).wortalGame.context.createAsync(playerId)
            .catch((e: any) => {
                throw rethrowPlatformError(e, "context.createAsync")
            });
    });
}

/**
 * This function determines whether the number of participants in the current game context is between a given minimum
 * and maximum, inclusive. If one of the bounds is null only the other bound will be checked against. It will always
 * return the original result for the first call made in a context in a given game play session. Subsequent calls,
 * regardless of arguments, will return the answer to the original query until a context change occurs and the query
 * result is reset.
 * @example
 * let result = Wortal.context.isSizeBetween(2, 4);
 * console.log(result.answer);
 * @param min Minimum number of players in context.
 * @param max Maximum number of players in context.
 * @returns {ContextSizeResponse} Object with the result of the check. Null if not supported.
 */
export function isSizeBetween(min?: number, max?: number): ContextSizeResponse | null {
    const platform = config.session.platform;
    if (platform === "link" || platform === "viber" || platform === "facebook") {
        return (window as any).wortalGame.context.isSizeBetween(min, max);
    } else {
        return null;
    }
}
