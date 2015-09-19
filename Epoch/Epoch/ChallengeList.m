//
//  ChallengeList.m
//  Epoch
//
//  Created by Bankole Adebajo on 2015-09-19.
//  Copyright © 2015 Banky. All rights reserved.
//

#import "ChallengeList.h"

#define kBaseURL "https://localhost:8080"
#define kGetUserChallenges "/get-locations"


@implementation ChallengeList {
    NSArray * tableData;
}

- (void)viewDidLoad {
    tableData = [[NSArray alloc] init];
    [self getUserChallenges];
}

- (NSArray *)getUserChallenges {
    NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"%s,%s",kBaseURL, kGetUserChallenges]];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"GET"];
    [request addValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    
    NSURLResponse *response;
    NSError *error;
    NSData *responseData = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:&error];
    
    
    NSError *jsonError;
    NSArray *json= [NSJSONSerialization JSONObjectWithData:responseData options:NSJSONReadingMutableContainers error:&jsonError];
    
    return json;

}
@end
