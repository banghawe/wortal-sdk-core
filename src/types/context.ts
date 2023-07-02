import { LocalizableContent } from "./localizable-content";

/**
 * Defines the filtering behavior
 *
 * - `NEW_CONTEXT_ONLY` only enlists contexts that the current player is in, but never participated in (e.g. a new context created by a friend).
 * - `INCLUDE_EXISTING_CHALLENGES` enlists contexts that the current player has participated before.
 * - `NEW_PLAYERS_ONLY` only enlists friends who haven't played this game before.
 * - `NEW_INVITATIONS_ONLY` only enlists friends who haven't been sent an in-game message before. This filter can be fine-tuned with `hoursSinceInvitation` parameter.
 */
export type ContextFilter = 'NEW_CONTEXT_ONLY'
    | 'INCLUDE_EXISTING_CHALLENGES'
    | 'NEW_PLAYERS_ONLY'
    | 'NEW_INVITATIONS_ONLY';

/**
 * A filter that may be applied to an inviteAsync operation. If no results are returned with the filters, then the filters will not be applied.
 *
 * - 'NEW_CONTEXT_ONLY' - Prefer to only surface contexts the game has not been played in before. This can include players who have not played the game before.
 * - 'NEW_PLAYERS_ONLY' - Prefer to only surface people who have not played the game before.
 * - 'EXISTING_CONTEXT_ONLY' - Prefer to only surface contexts the game has been played in before.
 * - 'EXISTING_PLAYERS_ONLY' - Prefer to only surface people who have played the game before.
 */
export type InviteFilter = 'NEW_CONTEXT_ONLY'
    | 'NEW_PLAYERS_ONLY'
    | 'EXISTING_CONTEXT_ONLY'
    | 'EXISTING_PLAYERS_ONLY';

/**
 * The type of the current game context.
 *
 * - `SOLO` - Default context, where the player is the only participant.
 * - `THREAD` - A chat thread.
 * - `POST` - A Facebook post - FB only
 * - `GROUP` - A Facebook group - FB only.
 */
export type ContextType = 'SOLO' | 'THREAD' | 'GROUP' | 'POST';

/**
 * A parameter that may be applied to a shareAsync operation. This set up sharing destination in the share dialog.
 * - 'NEWSFEED' - Enable share to newsfeed option
 * - 'GROUP' - Enable share to official game group option. This is only available for games with official game group. To set up official game group, add a page in the game app setting in https://www.developers.facebook.com, and then create a group for the page in https://facebook.com.
 * - 'COPY_LINK' - Enable copy the game link in clipboard
 * - 'MESSENGER' - Enable share game to messenger option
 */
export type ShareDestination = 'NEWSFEED' | 'GROUP' | 'COPY_LINK' | 'MESSENGER';

/**
 * Response from context.isSizeBetween API. Contains the answer and the min and max size.
 */
export interface ContextSizeResponse {
    answer: boolean,
    maxSize: number,
    minSize: number,
}
