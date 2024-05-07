//
//  IPFSModule.m
//  RNGoMobileIPFS
//
//  Created by APPLE on 07/05/24.
//

#import "IPFSModule.h"
#import <React/RCTLog.h>

@implementation IPFSModule

// To export a module named IPFSModule
RCT_EXPORT_MODULE(IPFSModule);

RCT_EXPORT_METHOD(sendMessage:(NSString *)message)
{
  RCTLogInfo(@"Sending message %@", message);
}



RCT_EXPORT_METHOD(startSubscription)
{
  RCTLogInfo(@"Starting subscription");
}

RCT_EXPORT_METHOD(start:(RCTResponseSenderBlock)callback)
{
  NSString *eventId = @"1234566";
  
  callback(@[eventId]);
}

@end
