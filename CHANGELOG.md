# Changelog

## [1.6.4] - 2023-08-25
### Added
- Ads
  - Backfill ads on Viber

### Fixed
- Ads
  - Duplicate ad event fired on preroll ads

## [1.6.3] - 2023-08-22
### Fixed
- Core
  - Possible initialization fail when using manual initialization on Wortal/GD platforms

## [1.6.2] - 2023-08-22
### Fixed
- Ads
  - Game Distribution callbacks attached to wrong events

### Changed
- Session
  - switchGameAsync is no longer available on Viber

## [1.6.1] - 2023-08-17
### Added
- Core
  - Tournament API
  - Demo project
  - Event for when SDK is initialized
  - Manual SDK initialization option
  - NPM package distribution
  - switchGameAsync API
- Ads
  - isAdBlocked API
- Session
  - getDevice, getOrientation, onOrientationChange APIs

### Changed
- Core
  - Improved integration docs

## [1.6.0] - 2023-08-10
### Added
- Analytics
  - Events for ad calls
- IAP
  - Facebook-only properties in IAP interfaces

### Fixed
- Core
  - Uncaught exceptions when validating API calls
  - Possible type mismatch in onPause argument
- Ads
  - Ad calls on Facebook no longer hang if ad unit IDs are missing
- Notifications
  - Error messages not returned on fetch fail

### Changes
- Core
  - Updated Viber SDK to 1.14.0
  - Merged wortal.js into SDK for scalability
  - Improve docs and SDK logging

## [1.5.0] - 2023-06-27

### Added

- Core
    - Notifications API
    - Haptic feedback
    - getSupportedAPIs to check if an API is supported on current platform
- Ads
    - Retry ads on no fill
- Analytics
    - Log traffic source on initialization
    - New events: logSocialInvite, logSocialShare, logPurchase, logPurchaseSubscription
    - Additional parameters in existing events
    - Events now use Wortal Game ID instead of platform for tracking
- Context
    - inviteAsync for social invites
    - New payload types for each API

### Fixed

- Ads
    - Facebook rewarded ad unit IDs not being parsed correctly
- Context
    - Facebook shareAsync error when using LocalizableContent
    - Docs contains reference to FB SDK

### Changed

- Analytics
    - logGameStart and logGameEnd now marked as private
- Context
    - chooseAsync no longer requires a payload

## [1.4.0] - 2023-04-24

### Added

- Ads
    - Viber support
    - noFill callback for ad calls
- Context
    - Group chat context for Facebook
    - New APIs: getType, getPlayersAsync, shareLinkAsync, isSizeBetween
- Player
    - New APIs: flushDataAsync, getASIDAsync, getSignedASIDAsync, canSubscribeBotAsync, subscribeBotAsync
- Session
    - New API: getPlatform

### Changed

- Core
    - Improved error handling
    - Improved docs
- Context
    - Some APIs can now return null
- Player
    - Some APIs can now return null

## [1.3.0] - 2023-02-21

### Added

- Core
    - Support for FB Instant Games
    - onPause callback

### Fixed

- Ads
    - Possible type mismatch for ad unit IDs
- IAP
    - Typo in iap.getPurchasesAsync docs

### Changed

- Analytics
    - Allow number params in analytics calls where previously only strings

## [1.2.0] - 2022-12-02

### Added

- Core
    - Support for Game Distribution platform
    - InitializationOptions (future use)
    - Documentation for error handling

### Fixed

- Leaderboard
    - Incorrect return values
- Session
    - Possible unhandled exception in session.setSessionData

## [1.1.2] - 2022-11-24

### Added

- Core
    - Improved error handling with ErrorMessages
    - Increased input validation
    - Validator utils
    - Converter utils

### Changed

- Core
    - Platform SDKs now rethrow errors for callers to handle

## [1.1.1] - 2022-11-22

### Added

- Leaderboard
    - Docs now include examples

### Fixed

- Leaderboard
    - Missing return values in API calls

### Changed

- Core
    - Added docs for additional types
- Context
    - API calls now only take ContextPayload parameters

## [1.1.0] - 2022-11-16

### Added

- Core
    - Examples in docs
- Player API
- Session API

### Fixed

- Core
    - Possible duplicate init call
- Ads
    - Ad callbacks not validated
- Context
    - Possible errors from invalid payload

### Changed

- Core
    - Enums to types for consistency
    - SDK namespace to API for clarity

## [1.0.0] - 2022-11-15

### Added

- Initial release
