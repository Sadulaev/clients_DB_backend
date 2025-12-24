export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    validation?: Record<string, string>;
    timestamp: string;
}




