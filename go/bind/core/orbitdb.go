package core

// import (
// 	"context"
// 	"encoding/base64"
// 	"encoding/json"
// 	"fmt"
// 	"log"
// 	"sync"

// 	orbitdb "berty.tech/go-orbit-db"
// 	node "github.com/ipfs-shipyard/gomobile-ipfs/go/pkg/ipfsmobile"

// 	iface "github.com/ipfs/interface-go-ipfs-core"
// 	"github.com/ipfs/kubo/core/coreapi"
// )

// type CoreAPIAdapter struct {
// 	mobileNode *node.IpfsMobile
// }

// var events []string
// var eventsMutex sync.Mutex

// type OrbitDBManager struct {
// 	OrbitDB *orbitdb.OrbitDB
// 	DB      orbitdb.EventLogStore
// }

// type Event struct {
// 	Address struct{} `json:"Address"`
// 	Entry   struct {
// 		Payload string `json:"payload"`
// 	} `json:"Entry"`
// 	Heads []struct {
// 		Payload string `json:"payload"`
// 	} `json:"Heads"`
// }

// type PayloadType struct {
// 	Op    string `json:"op"`
// 	Value string `json:"value"`
// }

// type ManifestParams struct {
// 	WriteAccess []string
// 	ReadAccess  []string
// }

// func (mp *ManifestParams) GetAccess() map[string]interface{} {
// 	return map[string]interface{}{
// 		"write": mp.WriteAccess,
// 		"read":  mp.ReadAccess,
// 	}
// }

// func NewOrbitDBManager(ctx context.Context, ipfsNode *node.IpfsMobile) (*OrbitDBManager, error) {
// 	// api, err := ipfsNode
// 	// if err != nil {
// 	// 	return nil, fmt.Errorf("error getting CoreAPI: %v", err)
// 	// }

// 	api := NewCoreAPIAdapter(ipfsNode)

// 	orbit, err := orbitdb.NewOrbitDB(ctx, api, nil)
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to create orbitdb: %s", err)
// 	}

// 	return &OrbitDBManager{
// 		OrbitDB: orbit,
// 	}, nil
// }

// func (manager *OrbitDBManager) SetupEventLogStore(ctx context.Context, dbName string) error {
// 	options := &orbitdb.CreateDBOptions{
// 		AccessController: &ManifestParams{
// 			WriteAccess: []string{"*"},
// 			ReadAccess:  []string{"*"},
// 		},
// 	}

// 	db, err := manager.OrbitDB.Log(ctx, dbName, options)
// 	if err != nil {
// 		return fmt.Errorf("failed to create event log: %s", err)
// 	}

// 	manager.DB = db
// 	return nil
// }

// func (manager *OrbitDBManager) SubscribeToEvents(ctx context.Context) {
// 	eventsChan := manager.DB.Subscribe(ctx)

// 	for {
// 		select {
// 		case event := <-eventsChan:
// 			var e Event
// 			log.Println("Received from channel eventsChan:", event)
// 			eventJSON, err := json.Marshal(event)
// 			if err != nil {
// 				fmt.Println("Error marshalling event:", err)
// 				continue
// 			}

// 			err = json.Unmarshal(eventJSON, &e)
// 			if err != nil {
// 				fmt.Println("Error unmarshalling event:", err)
// 				continue
// 			}

// 			payloadBytes, err := base64.StdEncoding.DecodeString(e.Entry.Payload)
// 			if err != nil {
// 				fmt.Println("Error decoding payload:", err)
// 				continue
// 			}

// 			payload := string(payloadBytes)

// 			var pt PayloadType

// 			er := json.Unmarshal([]byte(payload), &pt)
// 			if er != nil {
// 				fmt.Println("Error unmarshalling payload:", er)
// 				continue
// 			}

// 			decodedValue, err := base64.StdEncoding.DecodeString(pt.Value)
// 			if err != nil {
// 				fmt.Println("Error decoding payload:", err)
// 				continue
// 			}

// 			eventsMutex.Lock()
// 			events = append(events, string(decodedValue))
// 			eventsMutex.Unlock()
// 			log.Println("Received event:", e.Entry, pt, e.Address, string(decodedValue))

// 		case <-ctx.Done():
// 			return
// 		}
// 	}
// }

// func (manager *OrbitDBManager) GetEvents() []string {
// 	eventsMutex.Lock()
// 	defer eventsMutex.Unlock()

// 	// Create a copy of the events slice
// 	eventsCopy := make([]string, len(events))
// 	copy(eventsCopy, events)
// 	log.Println("Events:", eventsCopy)

// 	return eventsCopy
// }

// func (manager *OrbitDBManager) SendEvents(ctx context.Context, buffer []byte) {
// 	_, err := manager.DB.Add(ctx, []byte(buffer))
// 	if err != nil {
// 		log.Println("Error adding event to database:", err)
// 	}
// }

// // NewCoreAPIAdapter creates a new adapter instance
// func NewCoreAPIAdapter(mobileNode *IpfsMobile) iface.CoreAPI {
// 	return &CoreAPIAdapter{mobileNode: mobileNode}
// }

// // Block returns a BlockAPI interface for managing IPFS blocks
// func (ca *CoreAPIAdapter) Block() iface.BlockAPI {
// 	api, err := coreapi.NewCoreAPI(ca.mobileNode.IpfsNode)
// 	if err != nil {
// 		// Handle error or return a default or error-specific implementation
// 		panic(err) // for example purposes, handle appropriately in production
// 	}
// 	return api.Block()
// }

// // Dag returns a DagAPI interface for managing IPLD DAGs
// func (ca *CoreAPIAdapter) Dag() iface.APIDagService {
// 	api, _ := coreapi.NewCoreAPI(ca.mobileNode.IpfsNode)
// 	return api.Dag()
// }

// // Name returns a NameAPI interface for IPNS operations
// func (ca *CoreAPIAdapter) Name() iface.NameAPI {
// 	api, _ := coreapi.NewCoreAPI(ca.mobileNode.IpfsNode)
// 	return api.Name()
// }

// // Object returns an ObjectAPI for managing IPFS objects
// func (ca *CoreAPIAdapter) Object() iface.ObjectAPI {
// 	api, _ := coreapi.NewCoreAPI(ca.mobileNode.IpfsNode)
// 	return api.Object()
// }

// // Pin returns a PinAPI for pinning and unpinning objects
// func (ca *CoreAPIAdapter) Pin() iface.PinAPI {
// 	api, _ := coreapi.NewCoreAPI(ca.mobileNode.IpfsNode)
// 	return api.Pin()
// }

// // PubSub returns a PubSubAPI for publish/subscribe functionality
// func (ca *CoreAPIAdapter) PubSub() iface.PubSubAPI {
// 	api, _ := coreapi.NewCoreAPI(ca.mobileNode.IpfsNode)
// 	return api.PubSub()
// }

// // Key returns a KeyAPI for managing IPFS keys
// func (ca *CoreAPIAdapter) Key() iface.KeyAPI {
// 	api, _ := coreapi.NewCoreAPI(ca.mobileNode.IpfsNode)
// 	return api.Key()
// }

// // Dht returns a DhtAPI for interacting with the DHT
// func (ca *CoreAPIAdapter) Dht() iface.DhtAPI {
// 	api, _ := coreapi.NewCoreAPI(ca.mobileNode.IpfsNode)
// 	return api.Dht()
// }

// // Config returns a ConfigAPI for managing IPFS configuration
// func (ca *CoreAPIAdapter) Config() iface.ConfigAPI {
// 	api, _ := coreapi.NewCoreAPI(ca.mobileNode.IpfsNode)
// 	return api.Config()
// }

// // Other methods from iface.CoreAPI should be implemented here as needed
