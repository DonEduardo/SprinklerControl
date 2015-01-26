/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2015 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#import "TiButtonUtil.h"
#import "TiBase.h"


@implementation TiButtonUtil

+(UIView*)systemButtonWithType:(int)type
{
	switch (type)
	{
		case UIESP8266ControlNativeItemInfoLight:
		{
			return [UIButton buttonWithType:UIButtonTypeInfoLight];
		}
		case UIESP8266ControlNativeItemInfoDark:
		{
			return [UIButton buttonWithType:UIButtonTypeInfoDark];
		}
		case UIESP8266ControlNativeItemDisclosure:
		{
			return [UIButton buttonWithType:UIButtonTypeDetailDisclosure];
		}
		case UIESP8266ControlNativeItemContactAdd:
		{
			return [UIButton buttonWithType:UIButtonTypeContactAdd];
		}
		case UIESP8266ControlNativeItemSpinner:
		{
			UIActivityIndicatorView *button = [[[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhite] autorelease];
			[button startAnimating];
			return button;
		}
	}
	return nil;
}

+(UIView*)buttonWithType:(int)type
{
	UIView *button = [TiButtonUtil systemButtonWithType:type];
	if (button==nil)
	{
		button = [UIButton buttonWithType:type];
	}
	return button;
}

@end
