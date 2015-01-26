//
//  Appcelerator Titanium Mobile
//  WARNING: this is a generated file and should not be modified
//

#import <UIKit/UIKit.h>
#define _QUOTEME(x) #x
#define STRING(x) _QUOTEME(x)

NSString * const TI_APPLICATION_DEPLOYTYPE = @"development";
NSString * const TI_APPLICATION_ID = @"com.doneduardo.testnetsocket";
NSString * const TI_APPLICATION_PUBLISHER = @"Don Eduardo";
NSString * const TI_APPLICATION_URL = @"https://www.youtube.com/user/DonEduardo954/videos";
NSString * const TI_APPLICATION_NAME = @"ESP8266 Control";
NSString * const TI_APPLICATION_VERSION = @"1.0";
NSString * const TI_APPLICATION_DESCRIPTION = @"Basic Experimental program to test communication with an ESP8266 Wifi Module and an Arduino";
NSString * const TI_APPLICATION_COPYRIGHT = @"2015 by Don Eduardo";
NSString * const TI_APPLICATION_GUID = @"324a8b90-be5b-4a4c-bf8c-c7b2f62ee592";
BOOL const TI_APPLICATION_ANALYTICS = true;
NSString * const TI_APPLICATION_BUILD_TYPE = @"";

#ifdef TARGET_IPHONE_SIMULATOR
NSString * const TI_APPLICATION_RESOURCE_DIR = @"";
#endif

int main(int argc, char *argv[]) {
    NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];

#ifdef __LOG__ID__
	NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
	NSString *documentsDirectory = [paths objectAtIndex:0];
	NSString *logPath = [documentsDirectory stringByAppendingPathComponent:[NSString stringWithFormat:@"%s.log",STRING(__LOG__ID__)]];
	freopen([logPath cStringUsingEncoding:NSUTF8StringEncoding],"w+",stderr);
	fprintf(stderr,"[INFO] Application started\n");
#endif

	int retVal = UIApplicationMain(argc, argv, nil, @"TiApp");
    [pool release];
    return retVal;
}
