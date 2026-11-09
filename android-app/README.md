# IUT Learning — Android APK

This folder is the first standalone Android app setup for the IUT Learning Portal.

## Standalone behaviour
The HTML pages are copied into `www/` and packaged inside the APK by Capacitor.
The app opens local bundled files; it does not load the learning portal from GitHub
Pages and does not need Chrome to launch as a website.

This is a Capacitor hybrid Android app (native Android shell + locally bundled web
content), not a screen-by-screen Kotlin rewrite. It can later gain native Android
features and offline support.

## Requirements for a local build
- Node.js 22 or newer
- Android Studio with Android SDK Platform 35 or newer
- JDK 21

## Build on a computer
From this folder:

```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```

In Android Studio choose **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
The debug APK is normally created at:
`android/app/build/outputs/apk/debug/app-debug.apk`

For later HTML changes, update the matching files inside `www/`, then run:
`npx cap sync android`

## GitHub Actions
Open the repository's Actions tab and run **Build Android APK**. The workflow
builds a debug APK and uploads it as an artifact.

## Current content notes
- Existing repository HTML pages are bundled locally under `www/`.
- Links to pages not yet present in the website are given simple "Coming soon"
  placeholder pages in this app bundle.
- The Mathematics differentiation page currently loads KaTeX from a CDN. Its page
  content is local, but formula rendering needs internet until KaTeX is bundled
  locally in a later offline-support phase.
- The IUT official website link is external and needs internet.
