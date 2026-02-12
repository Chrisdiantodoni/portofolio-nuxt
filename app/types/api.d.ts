interface ApiResponse<T = any> {
  statusMessage: StringOrVNode | undefined;
  success: boolean;
  message: string;
  data?: T;
}
