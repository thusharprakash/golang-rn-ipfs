cd go/
go mod tidy
go mod download
go install golang.org/x/mobile/cmd/gobind
go run golang.org/x/mobile/cmd/gomobile init
cd bind/core
#go run golang.org/x/mobile/cmd/gomobile bind -v -target=ios -o ../../../build/ios/Core.xcframework
go run golang.org/x/mobile/cmd/gomobile bind  -o ../../../ios/RNGoMobileIPFS/Core.xcframework -v -tags=netgo -ldflags='-s -w' -target=ios
cd ../../../
npm run ios