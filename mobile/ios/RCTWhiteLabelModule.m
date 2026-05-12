#import "RCTWhiteLabelModule.h"

@implementation RCTWhiteLabelModule

RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport
{
  NSString *path = [[NSBundle mainBundle] pathForResource:@"whitelabel" ofType:@"json"];
  NSData *data = [NSData dataWithContentsOfFile:path];
  NSDictionary *dictionary = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:nil];
  
  NSString *GRAPH_URL = [dictionary objectForKey:@"graph_url"];
  NSString *IOS_STORE_ID = [dictionary objectForKey:@"ios_store_id"];
  NSString *URI_SCHEME = [dictionary objectForKey:@"uri_scheme"];
  NSDictionary *LIGHT_COLORS = [dictionary objectForKey:@"light_colors"];
  NSDictionary *DARK_COLORS = [dictionary objectForKey:@"dark_colors"];
  
  return @{ @"GRAPH_URL": GRAPH_URL, @"URI_SCHEME": URI_SCHEME, @"LIGHT_COLORS": LIGHT_COLORS, @"DARK_COLORS": DARK_COLORS, @"IOS_STORE_ID": IOS_STORE_ID };
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

@end
