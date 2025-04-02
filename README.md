
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

### iOS App Store Deployment

1. Prepare Your App
   - Update version numbers in `package.json` and `ios/App/App.xcodeproj/project.pbxproj`
   - Ensure all app icons and splash screens are properly configured
   - Test the production build thoroughly

2. Configure Xcode Project
   - Open Xcode project: `npx cap open ios`
   - Set Bundle Identifier (e.g., com.yourcompany.fitnessapp)
   - Configure signing certificates and provisioning profiles
   - Set up App Store Connect record for your app

3. Build and Archive
   - Select "Generic iOS Device" as the build target
   - Choose Product > Archive from the menu
   - In the Archives window, click "Distribute App"
   - Select "App Store Connect" and follow the upload steps

4. Submit for Review
   - Log in to App Store Connect (https://appstoreconnect.apple.com)
   - Complete app information, screenshots, and metadata
   - Submit for review through the platform

### Android Play Store Deployment

1. Prepare Your App
   - Update version codes in `android/app/build.gradle`
   - Ensure all app icons and splash screens are set
   - Test the production build thoroughly

2. Generate Release Bundle
   ```bash
   # Build the web app
   npm run build
   
   # Sync with Capacitor
   npx cap sync android
   
   # Open Android Studio
   npx cap open android
   ```

3. In Android Studio
   - Select Build > Generate Signed Bundle/APK
   - Choose Android App Bundle
   - Create or select a keystore file
   - Fill in the key store password, key alias, and key password
   - Select release build variant
   - Choose destination folder

4. Submit to Play Store
   - Log in to Google Play Console (https://play.google.com/console)
   - Create a new app or select existing app
   - Upload the .aab file in the Production track
   - Fill in store listing, content rating, and pricing
   - Submit for review

## Environment Setup

### Development Environment

1. Install Required Software:
   ```bash
   # Install Node.js (v16+)
   brew install node

   # Install Ionic CLI
   npm install -g @ionic/cli

   # Install Capacitor CLI
   npm install -g @capacitor/cli
   ```

2. iOS Development Setup:
   - Install Xcode from the Mac App Store
   - Install Xcode Command Line Tools:
     ```bash
     xcode-select --install
     ```
   - Install CocoaPods:
     ```bash
     sudo gem install cocoapods
     ```

3. Android Development Setup:
   - Download and install Android Studio
   - Install Android SDK through Android Studio
   - Set ANDROID_HOME environment variable
   - Add platform-tools to PATH

### Production Environment

1. Configure Environment Variables:
   ```bash
   # Create .env.production
   cp .env.example .env.production
   
   # Edit the file with production values
   nano .env.production
   ```

2. SSL Certificate Setup:
   - Obtain SSL certificate for production domain
   - Configure web server with SSL

3. Database Setup:
   - Configure production database settings
   - Run database migrations

## Troubleshooting

### Common Issues

1. Build Errors:
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules: `rm -rf node_modules`
   - Reinstall dependencies: `npm install`

2. iOS Specific:
   - Reset iOS simulator
   - Clean Xcode build: Xcode > Product > Clean Build Folder
   - Update CocoaPods: `pod update`

3. Android Specific:
   - Clear Android Studio cache
   - Invalidate caches: File > Invalidate Caches
   - Update Gradle: File > Sync Project with Gradle Files

### Support

For additional support:
- Check the [Issues](https://github.com/yourusername/fitness-system-evolution/issues) section
- Contact the development team
- Review the documentation in the `docs` folder
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
