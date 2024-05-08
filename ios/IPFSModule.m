//
//  IPFSModule.m
//  RNGoMobileIPFS
//
//  Created by APPLE on 07/05/24.
//

#import "IPFSModule.h"
#import <React/RCTLog.h>
#import "RNGoMobileIPFS-Swift.h"

@implementation IPFSModule
{
  IPFSInterOp *ipfs;
}

// To export a module named IPFSModule
RCT_EXPORT_MODULE(IPFSModule);

- (instancetype)init
{
  self = [super init];
  if (self) {
    ipfs = [[IPFSInterOp alloc] init];
  }
  return self;
}

RCT_EXPORT_METHOD(sendMessage:(NSString *)message)
{
  RCTLogInfo(@"Sending message %@", message);
  [ipfs sendMessageWithMessage:message];
}


RCT_EXPORT_METHOD(startSubscription)
{
  RCTLogInfo(@"Starting subscription");
  [ipfs startSubscriptionWithCallback:^(NSString * _Nullable message) {
    NSLog(@"%@", message);
    [self sendEventWithName:@"ORBITDB" body:@{@"message": message}];
  }];
  
  [ipfs startPeerCounterWithCallback:^(NSString * _Nullable message) {
    [self sendEventWithName:@"PEERS" body:@{@"peers": message}];
  }];
  
}

RCT_EXPORT_METHOD(start:(RCTResponseSenderBlock)callback)
{
  NSString *result = [ipfs start];
  callback(@[result]);
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"ORBITDB", @"PEERS"];
}

@end
