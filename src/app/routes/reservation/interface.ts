export interface error {
    invalidName?: string,
    invalidPhoneNumber?: string,
    invalidDatetime?: string,
}

export interface BranchServiceMap {
    [key: string]: string[];
}