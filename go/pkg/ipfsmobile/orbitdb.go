package node

import (
	"context"
	"fmt"

	orbitdb "berty.tech/go-orbit-db"
	"berty.tech/go-orbit-db/accesscontroller"
	"berty.tech/go-orbit-db/iface"
	coreapi "github.com/ipfs/interface-go-ipfs-core"
)


func CreateOrbitDb(ctx context.Context,coreApi coreapi.CoreAPI) (iface.EventLogStore, error){
	odb, err := orbitdb.NewOrbitDB(ctx, coreApi,&orbitdb.NewOrbitDBOptions{})
	if err != nil {
		return nil, fmt.Errorf("failed to init orbitdb: %s", err)
	}
	options := &orbitdb.CreateDBOptions{
		AccessController: accesscontroller.CloneManifestParams(
			&accesscontroller.CreateAccessControllerOptions{
				Access: map[string][]string{
					"write": {"*"},
					"read":  {"*"},
				},
			},
		),
	}

	db, err := odb.Log(ctx, "test_db", options)
	return db,err
}