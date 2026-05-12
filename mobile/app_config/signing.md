## Signing

To self-sign an aab or ipa for internal testing/verification, the folder structure should look something like:

```
/app_config
  /app_name
    /intellicomfort
      /signing
        /android
          alias_name # text file that contains the keystore alias
          key_password # text file that contains the key password
          keystore_password # text file that contains the keystore password
          prod.keystore # keystore
        /ios
          certificate.p12 # certificate
          embedded.mobileprovision # provisioning profile
          p12_password # text file that contains the password for the certificate
```

When all these items are present, you'll be able to run the fastlane commands with `internal_build:true` and end up with a signed aab, which can then be re-decompiled into an apk and installed on a device, or a resigned ipa that can be placed on a device.
