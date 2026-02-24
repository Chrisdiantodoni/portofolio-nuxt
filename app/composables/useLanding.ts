export const useLanding = () => {
  return {
    getNav: () => api.get<ApiResponse>("/landing/nav"),
    getHome: () => api.get<ApiResponse>("/landing/home"),
    getFooter: () => api.get<ApiResponse>("/landing/footer"),
  };
};
