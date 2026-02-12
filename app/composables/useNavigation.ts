// composables/useUser.ts
export const useNavigation = () => {
  return {
    addNewNavigation: (body: any) => api.post<ApiResponse>(`/navigation`, body),
    reorderNavigation: (body: any) =>
      api.patch<ApiResponse>(`/navigation/reorder`, body),
    deleteNavigation: (id: string) =>
      api.delete<ApiResponse>(`/navigation/${id}`),
    updateNavigation: (id: string, body?: any) =>
      api.put<ApiResponse>(`/navigation/${id}`, body),
    updateNavigationStatus: (id: string) =>
      api.patch<ApiResponse>(`/navigation/status/${id}`),
  };
};
