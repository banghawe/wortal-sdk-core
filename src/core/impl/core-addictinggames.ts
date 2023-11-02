import { AuthPayload } from "../../auth/interfaces/auth-payload";
import { AuthResponse } from "../../auth/interfaces/auth-response";
import { API_URL, SDK_SRC, WORTAL_API } from "../../data/core-data";
import { initializationError, notSupported } from "../../errors/error-handler";
import Wortal from "../../index";
import { debug } from "../../utils/logger";
import { onPauseFunctions } from "../../utils/wortal-utils";
import { CoreBase } from "../core-base";

/**
 * CrazyGames implementation of the Wortal SDK core functionality.
 * @hidden
 */
export class CoreAddictingGames extends CoreBase {
    constructor() {
        super();
    }

    protected authenticateAsyncImpl(payload?: AuthPayload): Promise<AuthResponse> {
        return Promise.reject(notSupported(undefined, WORTAL_API.AUTHENTICATE_ASYNC, API_URL.AUTHENTICATE_ASYNC));
    }

    protected initializeAsyncImpl(): Promise<void> {
        return this.defaultInitializeAsyncImpl();
    }

    protected linkAccountAsyncImpl(): Promise<boolean> {
        return Promise.reject(notSupported(undefined, WORTAL_API.LINK_ACCOUNT_ASYNC, API_URL.LINK_ACCOUNT_ASYNC));
    }

    protected onPauseImpl(callback: () => void): void {
        onPauseFunctions.push(callback);
    }

    protected performHapticFeedbackAsyncImpl(): Promise<void> {
        return Promise.reject(notSupported(undefined, WORTAL_API.PERFORM_HAPTIC_FEEDBACK_ASYNC, API_URL.PERFORM_HAPTIC_FEEDBACK_ASYNC));
    }

    protected setLoadingProgressImpl(progress: number): void {
        return;
    }

    protected startGameAsyncImpl(): Promise<void> {
        return this.defaultStartGameAsyncImpl();
    }

    protected _initializePlatformAsyncImpl(): Promise<void> {
        return new Promise((resolve, reject) => {
            const addictingGamesSDK = document.createElement("script");
            addictingGamesSDK.src = SDK_SRC.ADDICTING_GAMES_SDK;

            //TODO: do we need this? we're not using their popup dialogs so maybe not
            const addictingGamesCSS = document.createElement("link");
            addictingGamesCSS.rel = "stylesheet";
            addictingGamesCSS.type = "text/css";
            addictingGamesCSS.href = SDK_SRC.ADDICTING_GAMES_CSS;

            //TODO: remove this after it is included in the backend
            const testKey: string = "653c2f832eb434e0519f2eb3";
            addictingGamesSDK.onload = () => {
                if (typeof SWAGAPI === "undefined") {
                    reject(initializationError("Failed to load AddictingGames SDK.", "_initializePlatformAsyncImpl"));
                }

                const api = SWAGAPI.getInstance({
                    wrapper: document.body,
                    api_key: testKey,
                    theme: "shockwave", // Are there other themes? This is the only one I see in the SDK docs.
                    debug: true
                });

                api.startSession().then(() => {
                    debug("AddictingGames platform SDK loaded.");
                    Wortal._internalPlatformSDK = api;
                    resolve();
                });
            }

            addictingGamesSDK.onerror = () => {
                reject(initializationError("Failed to load AddictingGames SDK.", "_initializePlatformAsyncImpl"));
            }

            document.head.appendChild(addictingGamesSDK);
            document.head.appendChild(addictingGamesCSS);
        });
    }

    protected _initializeSDKAsyncImpl(): Promise<void> {
        return Promise.resolve(undefined);
    }

    protected _supportedAPIs: string[] = [

    ];
}
