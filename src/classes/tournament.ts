import { TournamentData } from "../interfaces/tournament";
import { debug } from "../utils/logger";

/**
 * Represents a tournament in the game.
 */
export class Tournament {
    private _current: TournamentData = {
        id: "",
        contextID: "",
        endTime: 0,
    }

    /** @hidden */
    constructor(id: string, contextID: string, endTime: number, title?: string, payload?: string) {
        debug(`Creating tournament: ${id} / ${contextID} / ${endTime} / ${title} / ${payload}`);
        // FB API docs say these are strings, but we're getting numbers returned.
        this._current.id = id.toString();
        this._current.contextID = contextID.toString();
        this._current.endTime = endTime;
        this._current.title = title;
        if (typeof payload === "string") {
            this._current.payload = JSON.parse(payload);
        }
    }

    /**
     * The ID of the tournament.
     */
    get id(): string {
        return this._current.id;
    }

    /**
     * The ID of the context in which the tournament is running.
     */
    get contextID(): string {
        return this._current.contextID;
    }

    /**
     * Unix timestamp of when the tournament ends.
     */
    get endTime(): number {
        return this._current.endTime;
    }

    /**
     * The title of the tournament.
     */
    get title(): string | undefined {
        return this._current.title;
    }

    /**
     * Payload attached to the tournament.
     */
    get payload(): object | undefined {
        return this._current.payload;
    }

    /**
     * Creates a mock tournament for debugging and testing purposes.
     * @hidden
     */
    static mock(): Tournament {
        return new Tournament("123456789", "987654321", 1234567890, "Test Tournament", '{"foo": "bar"}');
    }
}
