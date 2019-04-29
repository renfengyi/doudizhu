//
//  NativeGengine.h
//  KaleidoDoudizhuDemo-mobile
//
//  Created by 苏伟杰 on 2019/1/24.
//

#ifndef NativeGengine_h
#define NativeGengine_h

#import <Foundation/Foundation.h>
#import <Gengine/Gengine.h>
@interface NativeGengine : NSObject
+(void)clearCache;
+(BOOL)callNativeUIWithTitle:(NSString *) title andContent:(NSString *)content;
+(NSString*)createAccount:(NSString *)passphase;
+(NSString*)importAccount:(NSString *)mnemonic withPassword:(NSString *)password;
+(NSString*)getAccounts;
+(void)jsLog:(NSString *) loginfo;
+(BOOL)startGameEngineWithAccount:(NSString *) account andPassword:(NSString *) password;
+(BOOL)stopGameEngine;
+(BOOL)isRunning;
+(NSString *)balanceOfAccount:(NSString *)address;
+(NSString *)chargeForAccount:(NSString *)address;

@end

#endif /* NativeGengine_h */
