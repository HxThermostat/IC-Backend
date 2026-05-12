# Klimate Mobile

A React Native app with Android and iOS targets that can be easily white-labeled for any HVAC product with a Klimate backend.

## Installation

You should follow the basic React Native installation instructions to get started.

## IntelliComfort Release Info

Directory structure:

This directory structure is expected by the build process

- `/signing/ios/*`
- `/signing/android/*`

### iOS

The ios release signing requires a certificate, certificate password and mobileprovision file. These typically need to come from JCI's apple developer accounts when they expire.

Files needed:

- `/signing/ios/certificate.p12`: The .p12 certificate file from Apple
- `/signing/ios/p12_password`: The password of the .p12 certificate file
- `/signing/ios/embedded.mobileprovision`: The .mobileprovision file from Apple

### Android

The android release signing requires a keystore, alias_name, keystore_password and key_password file. This can be found in release-key.keystore in 1Password.

Files needed:

- `/signing/android/prod.keystore`
- `/signing/android/alias_name`
- `/signing/android/keystore_password`
- `/signing/android/key_password`

### Github Secret

Zip up the signing directory as a base64 string:

```sh
tar cz signing | base64 | pbcopy
```

Update the `INTELLICOMFORT_SIGNING_BASE64` secret in Github with the value in the clipboard. Run the `MOBILE-RELEASE` action.
