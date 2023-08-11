import * as _Wortal from './api';
import { debug, exception } from "./utils/logger";

// This was directly ported over from the deprecated wortal.js. We can probably find a better way to do this.
// See: https://developers.google.com/ad-placement/docs/example#indexhtml_web
//TODO: explore different implementations for this
(window as any).adsbygoogle = (window as any).adsbygoogle || [];
(window as any).adBreak = (window as any).adConfig = function (o: any) {
    (window as any).adsbygoogle.push(o);
};

// This is set by the Wortal backend and is used to identify a Wortal player via session.
//TODO: deprecate this when player persistence is implemented
(window as any).wortalSessionId = "";

// See: https://github.com/Digital-Will-Inc/wortal-sdk-core/issues/167
//TODO: check data attribute to determine if we should auto-initialize the SDK or not

/** Wortal API */
const Wortal = _Wortal;

Wortal._initializeInternal().then(() => {
    // This returns before the SDK is fully initialized due to some async calls and late initialization after
    // the platform SDKs finish loading. Do not rely on this for anything mission-critical.
    debug("SDK initializeInternal returned");
}).catch((error: any) => {
    exception("SDK failed to initialize.", error);
});

export default Wortal;
