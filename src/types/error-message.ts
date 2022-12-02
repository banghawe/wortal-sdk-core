/**
 * Error message that is thrown by the SDK. Some messages are re-thrown from platform SDKs.
 * Error codes:
 * <ul>
 * <li>INVALID_PARAMS - Invalid parameters were passed into the function. Check error.message for more details.</li>
 * <li>NOT_SUPPORTED - Function or feature is not currently supported on the platform currently being played on.</li>
 * <li>RETHROWN_FROM_PLATFORM - Not an actual code. An error that is rethrown from a 3rd party SDK. Code is passed from the platform, if available.</li>
 * </ul>
 */
export interface ErrorMessage {
    /** Code for the error. */
    code: string;
    /** Message details about the error. */
    message: string;
    /** Context details about the error. */
    context: string;
}
