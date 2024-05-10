//
//  IPFSInterOp.swift
//  RNGoMobileIPFS
//
//  Created by APPLE on 08/05/24.
//

import Foundation
import Core

@objc public class IPFSInterOp:NSObject{
  
  private let ipfs: IPFS?
  private var peerID: String?
  private var db:CoreOrbitDb?
  
  @objc public override init(){
    do{
      self.ipfs = try IPFS();
    }catch let error{
      print(error)
      self.ipfs = nil
      self.db = nil
    }
    self.peerID=""
    super.init()
  }
  
  @objc public func start() -> String?{
    do{
      try self.ipfs!.start()
      let res = try ipfs!.newRequest("id").sendToDict()
      self.peerID = (res!["ID"] as! String)
      self.db = CoreNewOrbitDB()
      return self.peerID
    }catch let error{
      print(error)
    }
    return "Failed to generate Peer ID"
  }
  
  @objc public func startSubscription(callback: @escaping (String?) -> Void){
    if let db = self.db {
      let callback = OrbitDbMessageCallback {message in
        callback(message)
      }
      db.startSubscription(callback)
      
    }
  }
  
  @objc public func sendMessage(message:String){
    if let db = self.db {
      db.sendEvents(message.data(using: .utf8))
    }
  }
  
  @objc public func startPeerCounter(callback: @escaping (String?) -> Void){
    self.updatePeerCount(callback: callback)
  }
  
  private func updatePeerCount(callback: @escaping (String?) -> Void) {
    DispatchQueue.global(qos: .background).asyncAfter(deadline: .now() + 1.0, execute: {
            if self.ipfs!.isStarted() {
                  do {
                    let res = try self.ipfs!.newRequest("/swarm/peers").sendToDict()
                      let peerList = res!["Peers"] as? NSArray
                      let jsonData = try JSONSerialization.data(withJSONObject: peerList ?? [], options: .prettyPrinted)
                      let jsonString = String(data: jsonData, encoding: .utf8)
                      callback(jsonString)
                  } catch let error {
                      print(error)
                  }
                  DispatchQueue.main.async {
                    self.updatePeerCount(callback: callback)
                  }
              }
          })
      }
}
