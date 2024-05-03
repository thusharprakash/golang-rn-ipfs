# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Building Golang SDK

You need

1. Golang 1.18 installed
2. For Android, Make sure NDK version 23.1.7779620 is installed.
3. Export below configurations to your `.zshrc` or `.bashrc` file

Run the below commands for the first time

```
npm install
cd go
go mod download
cd bind/core
go run golang.org/x/mobile/cmd/gomobile init

Also start the RN server by running `npm run start` in a seperate terminal
```

Now, to run the Android App,

```
./installAndroid.sh
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
