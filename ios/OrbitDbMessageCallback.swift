//
//  OrbitDbMessageCallback.swift
//  RNGoMobileIPFS
//
//  Created by APPLE on 08/05/24.
//

import Foundation
import Core

public class OrbitDbMessageCallback: NSObject, CoreMessageCallbackProtocol{
  private let callback: (String?) -> Void

  public init(callback: @escaping (String?) -> Void) {
    self.callback = callback
    super.init()
  }
  
  public func onMessage(_ p0: String?) {
    callback(p0)
  }

}
