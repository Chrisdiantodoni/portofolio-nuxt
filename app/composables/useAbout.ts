// composables/useUser.ts
export const useAbout = () => {
  return {
    updateAbout: (body: any) => api.post<ApiResponse>(`/about`, body),
  };
};
