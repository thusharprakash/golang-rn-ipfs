cd go/
go mod download
go run golang.org/x/mobile/cmd/gomobile init
GO111MODULE=on
cd bind/core
mkdir ../../../android/app/libs
go run golang.org/x/mobile/cmd/gomobile bind -v -target=android -o ../../../android/app/libs/core.aar  -androidapi 24
cd ../../../
yarn android
