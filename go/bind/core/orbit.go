package core

import (
	orbitdb "berty.tech/go-orbit-db"
)

type OrbitDBManager struct {
	OrbitDB *orbitdb.OrbitDB
	DB      orbitdb.EventLogStore
}

type Event struct {
	Address struct{} `json:"Address"`
	Entry   struct {
		Payload string `json:"payload"`
	} `json:"Entry"`
	Heads []struct {
		Payload string `json:"payload"`
	} `json:"Heads"`
}

type PayloadType struct {
	Op    string `json:"op"`
	Value string `json:"value"`
}

type ManifestParams struct {
	WriteAccess []string
	ReadAccess  []string
}


/**
internal code
**/

// func subscribeToEvents(ctx context.Context) {
// 	eventsChan := ipfs_node.GetOrbitDb().Subscribe(ctx)

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

// func getEvents() []string {
// 	eventsMutex.Lock()
// 	defer eventsMutex.Unlock()

// 	// Create a copy of the events slice
// 	eventsCopy := make([]string, len(events))
// 	copy(eventsCopy, events)
// 	log.Println("Events:", eventsCopy)

// 	return eventsCopy
// }

// func sendEvents(ctx context.Context, buffer []byte) {

// 	_, err := ipfs_node.GetOrbitDb().Add(ctx, []byte(buffer))
// 	if err != nil {
// 		log.Println("Error adding event to database:", err)
// 	}
// 	// fmt.Println("Exiting application.")
// }