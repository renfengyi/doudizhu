/****************************************************************************
 Copyright (c) 2013      cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#import "RootViewController.h"
#import "cocos2d.h"

#include "platform/CCApplication.h"
#include "platform/ios/CCEAGLView-ios.h"

#include <Gengine/Gengine.h>
#import "NativeGengine.h"

@implementation RootViewController

//#if DEBUG
//#define NSLog(FORMAT, ...) NSLog(@"LOG >> Function:%s Line:%d Content:%@\n", __FUNCTION__, __LINE__, [NSString stringWithFormat:FORMAT, ##__VA_ARGS__])
//#else
//#define NSLog(FORMAT, ...)
//#endif
/*
// The designated initializer.  Override if you create the controller programmatically and want to perform customization that is not appropriate for viewDidLoad.
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
if ((self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil])) {
// Custom initialization
}
return self;
}
*/

// Implement loadView to create a view hierarchy programmatically, without using a nib.
- (void)loadView {
    // Set EAGLView as view of RootViewController
    NSLog(@"%@", @"Before loadView");
    self.view = (__bridge CCEAGLView *)cocos2d::Application::getInstance()->getView();
    NSLog(@"%@", @"After loadView");
}

// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
    [super viewDidLoad];

//    GengineNode *node
    NSBundle *bundle = [NSBundle mainBundle];
    NSLog(@"%@", bundle.bundlePath);
    NSError *error = nil;
    NSString *dataDir = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
    BOOL b = GengineSetDataDirectory(dataDir, &error);
    NSLog(@"b: %i, error: %@", b, error);
//    b = [NativeGengine startGameEngine];
//    NSLog(@"startGameEngine: %i", b);
    
    //NSError *error = [[NSError alloc] init];
//    GengineNodeConfig *config = [[GengineNodeConfig alloc] init];
//    GengineEngineConfig *engineconfig = [[GengineEngineConfig alloc] init];
//    GengineNode *node = GengineNewNode(config, engineconfig, &error);
//    [node start: &error];
//    NSLog(@"%d", (int)error.code);
//    GengineKeyStore *keystore = GengineNewKeyStore([bundle.bundlePath stringByAppendingString:@"/keystore"], GengineStandardScryptN, GengineStandardScryptP);
//    GengineAccounts *accounts = [keystore getAccounts];
//    GengineAccount *account = [keystore newAccount:@"1234" error:&error];
//    BOOL b = [accounts set:0 account:account error:&error];
//    NSLog(@"set account %i", b);
//    NSLog(@"size %li", [accounts size]);
    NSLog(@"%@", @"Hello World");
//    NSURL *url = [NSURL URLWithString:@"http://explorer-testnet.kaleidochain.io/token/balanceof?address=0x1805b7ee5dd340981628b81d5d094c44a027bdc5"];
//    NSURLRequest *request = [[NSURLRequest alloc]initWithURL:url cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:10];
//    NSData *received = [NSURLConnection sendSynchronousRequest:request returningResponse:nil error:nil];
//    NSString *str = [[NSString alloc]initWithData:received encoding:NSUTF8StringEncoding];
//    NSLog(@"%@",str);
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
}

- (void)viewDidDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
}


// For ios6, use supportedInterfaceOrientations & shouldAutorotate instead
#ifdef __IPHONE_6_0
- (NSUInteger) supportedInterfaceOrientations{
    return UIInterfaceOrientationMaskAllButUpsideDown;
}
#endif

- (BOOL) shouldAutorotate {
    return YES;
}

- (void)didRotateFromInterfaceOrientation:(UIInterfaceOrientation)fromInterfaceOrientation {
    [super didRotateFromInterfaceOrientation:fromInterfaceOrientation];
}

//fix not hide status on ios7
- (BOOL)prefersStatusBarHidden {
    return YES;
}

// Controls the application's preferred home indicator auto-hiding when this view controller is shown.
- (BOOL)prefersHomeIndicatorAutoHidden {
    return YES;
}

- (void)didReceiveMemoryWarning {
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];

    // Release any cached data, images, etc that aren't in use.
}


@end
