# How to run this Ionic Project with Capacitor on Android Emulator

### Step 1: Install Dependencies
Navigate to your project directory and install the necessary dependencies using npm.

```
cd path/to/your/project
npm install
```

### Step 2: Build the Ionic Project
Build your Ionic project. This will create a `www` directory with the build output.

```
ionic build
```

### Step 3: Copy Web Assets
Copy the web assets to the native project. This step ensures that the latest build files are included in the Android project.

```
npx cap copy
```

### Step 4: Synchronize the Project
Sync the Capacitor plugins and dependencies with the native project.

```
npx cap sync
```

### Step 5: Open Android Studio
Open the Android project in Android Studio. This will allow you to run the app on an emulator or a physical device.

```
npx cap open android
```

### Step 6: Run the App on an Emulator
In Android Studio, select the desired emulator and click the "Run" button (green play icon) to build and run your app on the emulator.

---

Markdown written by: Lucas de Almeida.
GitHub: [lucasffa](https://github.com/lucasffa). 