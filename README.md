# Wortal SDK Core

This SDK is used to integrate games with the Wortal and syndicate them to multiple platforms. The goal is a write once,
run anywhere solution for HTML5 games. This is the core SDK that can be integrated directly into games or used as a
base for engine-specific SDKs.

### Building
`npm run build`

TODO: Add CI/CD

### Deploying
Upload to the Wortal bucket: `html5gameportal.com/wortal-sdk/`

Each deployment should have the version number in the filename. For example, `wortal-core-1.6.2.js`. In addition,
the `minor` version should be updated to point to the latest patch. For example, `wortal-core-1.6.js` should point to
`wortal-core-1.6.2.js` in this scenario. This allows us to push out patches without requiring game developers to
update their games.

We do not use a `latest` version as this can cause game breaking issues if a breaking change is introduced in the SDK.

When a game includes the SDK, it should use the gooogle storage URL instead of our CDN. For example:
https://storage.googleapis.com/html5gameportal.com/wortal-sdk/wortal-core-1.6.0.js. This is because `googleapis.com` is
already whitelisted on Facebook and other platforms. If we use our CDN, we will need to whitelist it on each platform
which may not always be possible.

### Testing
SDK changes are manually tested with demo projects and the Wortal SDK Test entity.

TODO: Add testing suite

### API Docs
`npm run document`

Public documentation is hosted [here](https://sdk.html5gameportal.com/).

Repo for docs is [here](https://github.com/Digital-Will-Inc/wortal-dev-docs).

The resulting documentation still requires some modification before it can be published. This is currently done manually.

### Stack
- TypeScript
- Webpack

### Task list
For SDK-related tasks please see this [ClickUp list](https://app.clickup.com/7540098/v/l/6-211197028-1).

## Plugins
All engine plugins have their own open-source repos. As each plugin has its own build and deploy process along with
documentation, please refer to their individual repos for more information. As the repos are public, any internal
information regarding them and their development should be kept in this repo.

- [Cocos 2.x](https://github.com/Digital-Will-Inc/wortal-sdk-cocos-2x)
- [Cocos 3.x](https://github.com/Digital-Will-Inc/wortal-sdk-cocos-3x)
- [Unity](https://github.com/Digital-Will-Inc/wortal-sdk-unity)
- [PlayCanvas](https://github.com/Digital-Will-Inc/wortal-sdk-playcanvas)
- [GameMaker Studio 2](https://github.com/Digital-Will-Inc/wortal-sdk-game-maker)
- [Construct 3](https://github.com/Digital-Will-Inc/wortal-sdk-construct)
- [Defold](https://github.com/Digital-Will-Inc/wortal-sdk-defold)

Plugin versions **do not** correspond to core SDK versions. Please refer to the individual plugin repos for version
and change information.

When new APIs or features are added, all plugins need to be updated to include these changes. If the changes made are
internal to the SDK and do not affect the public API, the plugins do not need to be updated as long as they point to the
correct minor version of the SDK that includes these changes.

### Updating plugins:
- **Cocos 2.x, Cocos 3.x and PlayCanvas** are all JS based and can be easily updated by providing a wrapper API for the new
    SDK APIs. These plugins can be updated in a relatively short time.
- **Unity** is C# based and needs interop code to be written for each new API. This can take a significant amount of time
    depending on the complexity of the API.
- **GameMaker Studio 2** uses a proprietary language called GML, but the plugin is written in JS. This means that the
    plugin can be updated in a relatively short time, but the GML code in the game needs to be updated to use the new
    APIs. This can take a significant amount of time depending on the complexity of the API.
- **Construct 3** uses a visual scripting system, but the plugin is written in JS. Construct runs the plugin in a worker
    thread, so there is some interop code that needs to be written to interface with the DOM. In addition, it requires
    some localization code to be written in multiple place. Updating this plugin takes a significant amount of time.
- **Defold** uses Lua so the plugin requires C++ interop code in addition to a JS lib that is used to communicate with
    the C++ code. Updating this plugin takes a significant amount of time.

### Deploying plugins:
- **Cocos 2.x and Cocos 3.x** get packaged as a `.zip` and uploaded to the Cocos Store.
- **Unity** gets packaged as a `.unitypackage` and served from the `Releases` tab on GitHub.
- **PlayCanvas** gets served from either the PlayCanvas project which is public or the `Releases` tab on GitHub.
- **GameMaker Studio 2** gets packaged as a `.yymp` and uploaded to the YoYo Marketplace. This is a process
   that involves uploading the file to the marketplace via the editor then publishing the new version via their website.
- **Construct 3** gets packaged as a `.c3addon` (which is a renamed `.zip`) and uploaded to their store.
- **Defold** gets served directly from the GitHub link.

### Links
- [Cocos Store Dashboard](https://store-my.cocos.com/seller/resources)
  - Publisher account: `Digital_Will`
- [GameMaker Marketplace](https://marketplace.gamemaker.io/publishers/tools/assets/11217/edit)
  - Publisher account: `will+opera@digitalwill.co.jp`
- [Construct Addons](https://www.construct.net/en/make-games/addons/897/wortal/edit)
  - Publisher account: `dw_will`
- [PlayCanvas Project](https://playcanvas.com/project/984829/overview/wortal-sdk)
  - Publisher account: `digital_will`

