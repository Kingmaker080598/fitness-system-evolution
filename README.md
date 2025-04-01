
# Fitness System Evolution Mobile App

A comprehensive fitness and health tracking mobile application that works on both iOS and Android devices.

## Features

- User authentication and profile management
- Workout tracking and planning
- Health metrics monitoring
- Bluetooth device connectivity
- Daily activity tracking
- Social sharing capabilities

## Technology Stack

- React + TypeScript
- Tailwind CSS for styling
- Capacitor for native mobile functionality
- Recharts for data visualization
- Web Bluetooth API for device connectivity

## Development Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- For iOS builds: macOS with Xcode installed
- For Android builds: Android Studio with SDK tools

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fitness-system-evolution
```

2. Install dependencies:
```bash
npm install
```

3. Build the web application:
```bash
npm run build
```

4. Sync the web application with Capacitor:
```bash
npx cap sync
```

### Running the Application

#### Web Development (for testing)
```bash
npm run dev
```

#### iOS
```bash
npx cap open ios
```
Then use Xcode to run the application on a simulator or physical device.

#### Android
```bash
npx cap open android
```
Then use Android Studio to run the application on an emulator or physical device.

### Adding Platforms

If you need to add iOS or Android platforms:

```bash
npx cap add ios
npx cap add android
```

### Updating after Code Changes

After making changes to the web application:

1. Build the application:
```bash
npm run build
```

2. Sync changes with Capacitor:
```bash
npx cap sync
```

## Deploying to App Stores

### iOS App Store

1. In Xcode, select "Generic iOS Device" as the build target
2. Go to Product > Archive
3. Once archiving is complete, click "Distribute App"
4. Follow the prompts to upload to the App Store
5. Complete the app submission in App Store Connect

### Google Play Store

1. In Android Studio, go to Build > Generate Signed Bundle/APK
2. Select "Android App Bundle" or "APK" (App Bundle is recommended)
3. Create or select a keystore for signing
4. Follow the prompts to generate the release build
5. Upload the generated .aab or .apk file to the Google Play Console
6. Complete the app submission process

## Updating Native Configurations

To modify Capacitor configuration, edit the `capacitor.config.ts` file and then run:

```bash
npx cap sync
```

## Adding Native Plugins

To add Capacitor plugins for native functionality:

```bash
npm install @capacitor/plugin-name
npx cap sync
```

## Troubleshooting

- If you encounter build errors, check that all dependencies are properly installed
- Ensure Xcode and Android Studio are up to date
- For iOS device testing, verify that your developer certificate is valid
- For Android device testing, ensure USB debugging is enabled

## License

[Your License Information]
