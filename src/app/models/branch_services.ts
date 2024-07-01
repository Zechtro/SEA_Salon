export interface BranchServices {
    // branch_name will be Document ID
    service_name: string,
    is_available: boolean
}

export function createBranchServices(service_name: string, is_available: boolean): BranchServices {
    return {
        service_name: service_name,
        is_available: is_available
    }
}