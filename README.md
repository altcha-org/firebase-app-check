# Firebase App Check Provider with ALTCHA

This repository provides a custom App Check provider implementation for Firebase using ALTCHA. ALTCHA is a privacy-focused proof-of-work-based system that helps secure websites and APIs from spam and unwanted content.

## Usage

### 1. Install the Firebase extension

Install the [ALTCHA App Check Provider](https://console.firebase.google.com/u/0/project/_/extensions/install?ref=altcha%2Faltcha-app-check-provider@0.0.4-alpha.0).

During the installation, configure your unique secret `HMAC Key` (a sufficiently long random string). You may adjust other configuration options, though the default values are usually sufficient.

Copy the URLs of the two deployed functions—you'll need to configure these in the CustomProvider.

### 2. Integrate CustomProvider in your app

Run the following command to add the ALTCHA provider to your project:

```sh
npm install @altcha/firebase-app-check
```

Create a new CustomProvider for App Check:

```js
import { AltchaProviderOptions } from '@altcha/firebase-app-check';

const firebaseConfig = {
  // your usual Firebase config
  appId: '...'
};

const app = initializeApp(firebaseConfig);

const altchaProviderOptions = new AltchaProviderOptions({
  appId: firebaseConfig.appId,
  createAltchaChallengeUrl: 'https://.../ext-altcha-app-check-provider-createAltchaChallenge',
  createAppCheckTokenUrl: 'https://.../ext-altcha-app-check-provider-createAppCheckToken',
});
const provider = new CustomProvider(altchaProviderOptions);

initializeAppCheck(app, { provider });
```

Replace `createAltchaChallengeUrl` and `createAppCheckTokenUrl` with URLs of the functions deployed by the extension (step 1).

### Troubleshooting

#### Permission 'iam.serviceAccounts.signBlob' denied

If the `createAppCheckToken` function fails with the error `Permission 'iam.serviceAccounts.signBlob' denied...`, you need to grant a new role to the extension's service account:

```sh
gcloud projects add-iam-policy-binding PROJECT_ID --member=serviceAccount:ext-altcha-app-check-provider@PROJECT_ID.iam.gserviceaccount.com --role='roles/iam.serviceAccountTokenCreator'
```

Replace `PROJECT_ID` with your actual project ID from the Firebase console.

**Note:** Adding the role via the Google Console UI may not work. It's recommended to use the `gcloud` CLI to apply this role.

## License

MIT