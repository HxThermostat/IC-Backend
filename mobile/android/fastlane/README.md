# fastlane documentation

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using

```
[sudo] gem install fastlane -NV
```

or alternatively using `brew install fastlane`

# Available Actions

## Android

### android build_all_apps

```
fastlane android build_all_apps
```

Build and white label Android (all apps)

### android build

```
fastlane android build
```

Build and white label Android

### android build_aab

```
fastlane android build_aab
```

Build klimate.aab used for white labeling

### android unpack_and_install_aab

```
fastlane android unpack_and_install_aab
```

Unpacks a white-labelled aab, and installs it onto a connected device

---

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
