import Wortal from "../index";

// the mount point for xsolla authentication
const XSOLLA_AUTH_DIV_ID = "c2fa61d4-fa24-4143-a565-9be77f319ea5";

interface XsollaLoginWidget extends EventListener {
    events: {
        Close: string;
        LoginSuccess: string;
        SignupSuccess: string;
    },
    mount(elementId: string): void,
    on(event: string, callback: (event: any) => void): void,
    once(event: string, callback: (event: any) => void): void,
    open(): void,
}
let xsollaWidget: XsollaLoginWidget | null = null;

/**
 * Get the Xsolla Login SDK mount point or create it if it doesn't exist
 * @returns HTMLDivElement
 */
function getXsollaAuthDiv(): HTMLDivElement {
    let el = document.getElementById(XSOLLA_AUTH_DIV_ID) as HTMLDivElement;
    if (!el) {
        el = document.createElement('div')
        el.id = XSOLLA_AUTH_DIV_ID
        el.style.display = 'none'
        document.body.appendChild(el)
    }
    return el
}

/**
 * Get the Xsolla Login SDK widget object
 * @returns XsollaLogin.Widget
 */
export async function getXsollaWidget(): Promise<XsollaLoginWidget> {
    if (xsollaWidget) return xsollaWidget

    if (!window.XsollaLogin) {
        throw new Error("Xsolla Login SDK is not loaded");
    }

    // should not be on an iframe
    if (window.location !== window.parent.location) {
        throw new Error("Xsolla Login Widget cannot be loaded in an iframe");
    }

    const sdkParameters = await Wortal.getSDKParameters();
    if (!sdkParameters.xsollaLoginProjectID) {
        throw new Error("Xsolla Login Project ID is not set");
    }
    const callbackUrl = "https://login.xsolla.com/api/social/oauth2/callback";

    xsollaWidget = new window.XsollaLogin.Widget({
        projectId: sdkParameters.xsollaLoginProjectID,
        // scope: 'offline',
        callbackUrl,
        // set enablePostMessageLogin to `true` to use events to avoid redirect whenever possible
        // in order to support social login you must also set socialLoginFlow: "newTab"
        enablePostMessageLogin: true,
        socialLoginFlow: "newTab",
    });
    return xsollaWidget!;
}

/**
 * Open the Xsolla Login SDK widget dialog window
 */
export async function xsollaLogin(): Promise<string> {
    const xsollaWidget = await getXsollaWidget();
    const el = getXsollaAuthDiv();
    xsollaWidget.mount(XSOLLA_AUTH_DIV_ID);
    el.style.display = 'block';
    return new Promise((resolve, reject) => {
        xsollaWidget.once(xsollaWidget.events.Close, function (e: any) {
            Wortal._log.debug('user has closed the widget');
            el.style.display = 'none';
            reject(e);
        });
        xsollaWidget.once(xsollaWidget.events.LoginSuccess, function (event: any) {
            Wortal._log.debug('user logged in successfully', {event});
            el.style.display = 'none';
            resolve(event.params.token);
        });
        xsollaWidget.once(xsollaWidget.events.SignupSuccess, function (event: any) {
            Wortal._log.debug('user signed up successfully', {event});
            el.style.display = 'none';
            resolve(event.params.token);
        });
        xsollaWidget.open();
    });
}

/**
 * Get Xsolla JWT token from the URL query string
 * @returns string Xsolla JWT token
 */
export function getXsollaToken(): string | null {
    if (window.xsollaJwtToken) return window.xsollaJwtToken;
    const currentUrl = new URL(window.location.href);
    return currentUrl.searchParams.get('token');
}

export interface XsollaGroup {
    id: number;
    name: string;
    is_default: boolean;
}

export interface XsollaPayload {
    email: string;
    exp: number;
    groups: XsollaGroup[];
    iat: number;
    id: string;
    is_master: boolean;
    iss: string;
    name: string;
    picture: string;
    provider: string;
    publisher_id: number;
    sub: string;
    type: string;
    username: string;
    xsolla_login_access_key: string;
    xsolla_login_project_id: string;
}

/**
 * Parse Xsolla JWT token payload
 * @param token Xsolla JWT token
 * @returns parsed payload content
 */
export function parseXsollaToken(token: string): XsollaPayload {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
}

/**
 * Checking if the Xsolla JWT token is expired
 * @param payload parsed Xsolla JWT token payload
 * @returns true if the token is expired
 */
export function isExpired(payload: XsollaPayload): boolean {
    return payload.exp < Date.now() / 1000;
}
