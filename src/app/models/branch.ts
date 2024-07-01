export interface BranchInfo {
    branch_name: string,
    location: string,
    open_time: string,
    close_time: string
}

export function createBranch(branch_name:string, location:string, open_time:string, close_time:string):BranchInfo{
    return {
        branch_name: branch_name,
        location: location,
        open_time: open_time,
        close_time: close_time
    }
}