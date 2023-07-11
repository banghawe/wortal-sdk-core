import { GameData } from "../interfaces/session";
import { Platform, SessionData } from "../types/session";
// @ts-ignore
import country from "../utils/intl-data.json";

/** @hidden */
export class Session {
    private _current: SessionData = {
        country: "",
        platform: "debug",
        gameId: "",
        browser: "",
    };

    constructor() {
        this._current.country = this._setCountry();
        this._current.platform = (window as any).getWortalPlatform();
        if (this._current.platform === "wortal") {
            if (!this._isValidWortal()) {
                this._current.platform = "debug";
            }
        }
        this._current.gameId = this._setGameID();
        this._current.browser = navigator.userAgent;
        console.log("[Wortal] Session initialized: ", this._current);
    }

    get gameId(): string {
        return this._current.gameId;
    }

    get browser(): string {
        return this._current.browser;
    }

    get platform(): Platform {
        return this._current.platform;
    }

    get country(): string {
        return this._current.country;
    }

    private _setCountry(): string {
        const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const arr = zone.split("/");
        const city = arr[arr.length - 1];
        return country[city];
    }

    private _setGameID(): string {
        // We sync the different IDs on the backend, we'll just parse the URL here and yeet it into Wombat as is.
        let url: string[] = [];
        let subdomain: string[] = [];
        let id: string;

        switch (this.platform) {
            case "wortal":
                // Example URL: https://gameportal.digitalwill.co.jp/games/cactus-bowling/19/
                // ID: 19
                url = document.URL.split("/");
                id = url[5];
                break;
            case "link":
                // Example URL: https://05cabb33-07f4-4074-8ebd-69b78815697a.g.rgsbx.net/11/index.html
                // ID: 05cabb33-07f4-4074-8ebd-69b78815697a
                url = document.URL.split("/");
                subdomain = url[2].split(".");
                id = subdomain[0];
                break;
            case "viber":
                // Example URL: https://r83ysr3u613lxyh8u93piwf0h0jbxbhk.g.vbrplsbx.io/44/index.html
                // ID: r83ysr3u613lxyh8u93piwf0h0jbxbhk
                url = document.URL.split("/");
                subdomain = url[2].split(".");
                id = subdomain[0];
                break;
            case "gd":
                // Example URL: https://revision.gamedistribution.com/b712105e1fff4bceb87667522d798f97
                // ID: b712105e1fff4bceb87667522d798f97
                url = document.URL.split("/");
                id = url[3];
                break;
            case "facebook":
                id = (window as any).wortalGameID;
                break;
            case "debug":
            default:
                id = "debug";
                break;
        }

        console.log("[Wortal] Game ID: " + id);
        return id;
    }

    // Calling getWortalPlatform() from the backend will default to returning "wortal" if no other platform
    // match is found. We want to set the platform to "debug" if we're not on an actual wortal domain.
    private _isValidWortal(): boolean {
        const domains: string[] = ["html5gameportal.com", "html5gameportal.dev"]
        const location = window.location;
        const host = location.host
        for (let i = 0; i < domains.length; i++) {
            if (host.indexOf(domains[i]) !== -1) {
                return true;
            }
        }
        return false;
    }
}

/** @hidden */
export class GameState {
    private _current: GameData = {
        gameTimer: 0,
        levelName: "",
        levelTimer: 0,
        levelTimerHandle: 0
    };

    get gameTimer(): number {
        return this._current.gameTimer;
    }

    startGameTimer(): void {
        window.setInterval(() => {
            if (document.visibilityState !== "hidden") {
                this._current.gameTimer += 1
            }
        }, 1000);
    }

    get levelName(): string {
        return this._current.levelName;
    }

    setLevelName(name: string): void {
        this._current.levelName = name;
    }

    get levelTimer(): number {
        return this._current.levelTimer;
    }

    resetLevelTimer(): void {
        this._current.levelTimer = 0;
    }

    startLevelTimer(): void {
        this._current.levelTimerHandle = window.setInterval(() => this._current.levelTimer += 1, 1000);
    }

    clearLevelTimerHandle(): void {
        if (this._current.levelTimerHandle !== null) {
            clearInterval(this._current.levelTimerHandle);
        }
        this._current.levelTimerHandle = 0;
    }
}
