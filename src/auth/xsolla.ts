// the mount point for xsolla authentication
const XSOLLA_AUTH_DIV_ID = "c2fa61d4-fa24-4143-a565-9be77f319ea5";

let xsollaWidget: any = null;

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

export function getXsollaWidget() {
    if (xsollaWidget) return xsollaWidget
    if (window.XsollaLogin && window.xsollaLoginProjectID) {
        xsollaWidget = new window.XsollaLogin.Widget({
            projectId: window.xsollaLoginProjectID,
            scope: 'offline',
            callbackUrl: window.location.href,
        });
        return xsollaWidget;
    }
}

export function xsollaLogin() {
    const xsollaWidget = getXsollaWidget();
    const el = getXsollaAuthDiv();
    xsollaWidget.mount(XSOLLA_AUTH_DIV_ID);
    el.style.display = 'block';
    xsollaWidget.open();
}

export function getXsollaToken(): string | null {
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

export function parseXsollaToken(token: string): XsollaPayload {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
}

export function isExpired(payload: XsollaPayload): boolean {
    return payload.exp < Date.now() / 1000;
}
