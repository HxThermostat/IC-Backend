# White label configuration

## General

Each app needs to have a whitelabel.json. You can copy the structure
from `klimate/whitelabel.json` and use the following reference to
determine appropriate values:

- `android_store_id` - the `?id=` query parameter from the app's URL on the Google Play store (presumably always the same as the Bundle ID)
- `bundle_id_android` - the Android app's Bundle ID from the Play Store
- `bundle_id_ios` - the iOS app's Bundle ID from App Store Connect
- `dark_colors` - key-value pairs of color palette names and their hex color values when in dark mode (e.g. `{ "text": "#EFEFEF" }`)
- `display_name` - the human-friendly app name in the App Store and Play Store
- `google_services` - a subset of the values from the `google-services.json` file used by the Android build (see https://github.com/kraftful/klimate/blob/ffbe7b9f11f1716999c17d3e505d30a4f1256e80/mobile/android/fastlane/Fastfile#L76-L118)
- `graph_url` - the URL the app will communicate with
- `home_name` - the host name used for universal links, typically in the form of `<app_name>.kraftful.app`
- `ios_store_id` - the numerical component of the app ID from the App Store url (e.g. `https://apps.apple.com/us/app/intellicomfort/id794980960` => `794980960`)
- `light_colors` - key-value pairs of color palette names and their hex color values when in light mode (e.g. `{ "text": "#181718" }`)
- `splash_screen_background` - key-value mapping for the background color of the spash screen in dark and light mode (e.g. `{ "dark": "#000000", "light": "#F1F1F1" }`)
- `team_id` - App Store Connect team ID
- `uri_scheme` - scheme name for deep links on iOS (e.g. `<scheme>://sign_in`)
- `version_name_android` - the app version visible in the Play Store
- `version_name_ios` - the app version visible in the App Store

## Icons

All of the icon assets should be full-bleed. We process the source
images and apply masks as appropriate for the platform.

### Android

The Android icons are composed of a foreground and background layer.
This affords some neat paralax effects, but it can take some fiddling
to get it right. The foreground should have a 260px padding on all
four sides to be centered. For more interesting examples, check out
this
[Google Design post](https://medium.com/google-design/designing-adaptive-icons-515af294c783)

- `android_adaptive_background.png` - 1536 × 1536 PNG with alpha transparency
- `android_adaptive_foreground.png` - 1536 × 1536 PNG with alpha transparency
- `android_notification.png` - 96 × 96 PNG with alpha transparency and a white foreground

### iOS

- `ios.png` - 1024x1024 PNG with alpha transparency

## Signing

The files used for signing (e.g. `app_config/*/signing/*`) are
gitignored for security purposes. When building locally or to
construct the value used by GitHub Actions, you'll need to have the
following directory structure in your checkout:

```
android/
  alias_name
  key_password
  keystore_password
  prod.keystore
ios/
  certificate.p12
  embedded.mobileprovision
  p12_password
```

### Android

- `alias_name` - text file containing the key alias for the signing key from the keystore
- `key_password` - text file containing the key password for the signing key from the keystore
- `keystore_password` - text file containing the password to unlock the keystore
- `prod.keystore` - the keystore file

### iOS

- `certificate.p12` - the iPhone Distribution certificate file as a PKCS 12 (e.g. .p12), likely exported from Keychain Access
- `embedded.mobileprovision` - the provisioning profile downloaded from the Apple Developer site
- `p12_password` - text file containing the password used to encrypt the `certificate.p12` file
