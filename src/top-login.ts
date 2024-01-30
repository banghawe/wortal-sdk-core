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

function createScriptElement(): Promise<HTMLScriptElement> {
    return new Promise((resolve, reject) => {
        const scriptId = `${XSOLLA_AUTH_DIV_ID}-script`
        let scriptEl = document.getElementById(scriptId) as HTMLScriptElement;
        if (!scriptEl) {
            scriptEl = document.createElement('script');
            scriptEl.id = scriptId;
            scriptEl.src = "https://login-sdk.xsolla.com/latest/";
            scriptEl.onload = () => {
                resolve(scriptEl)
            }
            scriptEl.onerror = () => {
                reject(new Error('xsolla login sdk is not loaded'));
            }
            document.body.appendChild(scriptEl);
        }
    });
}

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

interface InitializeLoginOptions {
    projectId: string;
    callbackUrl: string;
    iframe: HTMLIFrameElement;
}

const MESSAGE_PREFIX = 'wortalSDK::';
export enum MessageType {
    StartLogin = `${MESSAGE_PREFIX}start-login`,
    StartLoginResponse = `${MESSAGE_PREFIX}start-login-response`,
    Status = `${MESSAGE_PREFIX}status`,
    StatusResponse = `${MESSAGE_PREFIX}status-response`,
}

/**
 * Get the Xsolla Login SDK widget object
 * @returns XsollaLogin.Widget
 */
export async function initializeLogin({iframe, ...options}: InitializeLoginOptions): Promise<XsollaLoginWidget> {
    // should not be on an iframe
    if (window.location !== window.parent.location) {
        throw new Error("Login Widget cannot be loaded in an iframe");
    }

    await createScriptElement();
    const xlMount = getXsollaAuthDiv();

    if (!window.XsollaLogin) {
        throw new Error("Xsolla Login SDK is not loaded");
    }

    const xsollaWidget = new window.XsollaLogin.Widget({
        ...options,
        // set enablePostMessageLogin to `true` to use events to avoid redirect whenever possible
        // in order to support social login you must also set socialLoginFlow: "newTab"
        enablePostMessageLogin: true,
        socialLoginFlow: "newTab",
    }) as XsollaLoginWidget;

    window.addEventListener('message', (event) => {
        // ignore if the message is not from the iframe
        if (event.source !== iframe.contentWindow) return;
        switch (event.data.type as MessageType) {
            case MessageType.StartLogin:
                xlMount.style.display = 'block';
                xsollaWidget.open();
                break;
            case MessageType.Status:
                iframe.contentWindow!.postMessage({
                    type: MessageType.StatusResponse,
                    success: true,
                });
                break;
        }
    });

    xsollaWidget.on(xsollaWidget.events.LoginSuccess, (event) => {
        console.log('LoginSuccess in parent', event);
        iframe.contentWindow!.postMessage({
            type: MessageType.StartLoginResponse,
            success: true,
            token: event.params.token,
        });
        xlMount.style.display = 'none';
    });

    xsollaWidget.mount(XSOLLA_AUTH_DIV_ID);
    return xsollaWidget;
}


declare global {
    interface Window {
        initializeLogin: typeof initializeLogin;
        // XsollaLogin: any;
    }
}

window.initializeLogin = initializeLogin;
