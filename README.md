# About Project

This project aims to bring IPFS support in Mobile Apps (Via React Native as F.E) with the help of <https://github.com/ipfs-shipyard/gomobile-ipfs> library which is written in Golang.

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Building Golang SDK

You need

1. Golang 1.18 installed
2. Java 17 or higher installed.
3. For Android, Make sure NDK version 23.1.7779620 is installed.
4. Add below configurations to your `.zshrc` or `.bashrc` file

```
macOS
export GOPATH="$HOME/go"
export PATH="$PATH:$GOPATH/bin"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_NDK_HOME="$ANDROID_HOME/ndk/23.1.7779620"
export PATH="$PATH:$ANDROID_HOME/emulator"
export PATH="$PATH:$ANDROID_HOME/platform-tools"
export JAVA_HOME="/Applications/Android Studio.app/Contents/jre/Contents/Home"
```

Run the below commands for the first time

```
npm install
cd go
go mod download
cd bind/core
go run golang.org/x/mobile/cmd/gomobile init

Also start the RN Metro server by running `npm run start` in a seperate terminal
```

Now, to run the Android App,

```
./installAndroid.sh
```

Now, to run the iOS App,

```
./buildiOS.sh
```

## Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

```

```
