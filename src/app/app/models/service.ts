export interface ServiceInfo {
    service_name: string,
    duration: number,
    image_path: string
}

export function createService(service_name: string, duration: number): ServiceInfo{
    return {
        service_name: service_name,
        duration: duration,
        image_path: "../../public/assets/service_image/other.jpg"
    }
}