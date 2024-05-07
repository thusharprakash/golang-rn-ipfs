cd go/
go mod tidy
go mod download
go install golang.org/x/mobile/cmd/gobind
go run golang.org/x/mobile/cmd/gomobile init
cd bind/core
go run golang.org/x/mobile/cmd/gomobile bind -v -target=ios -o ../../../build/ios/Core.xcframework