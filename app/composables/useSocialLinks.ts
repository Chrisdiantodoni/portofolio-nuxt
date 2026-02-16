// composables/useUser.ts
export const useSocialLinks = () => {
  return {
    addNewSocialLinks: (body: any) =>
      api.post<ApiResponse>(`/social-links`, body),
    reorderSocialLinks: (body: any) =>
      api.patch<ApiResponse>(`/social-links/reorder`, body),
    deleteSocialLinks: (id: string) =>
      api.delete<ApiResponse>(`/social-links/${id}`),
    updateSocialLinks: (id?: number, body?: any) =>
      api.put<ApiResponse>(`/social-links/${id}`, body),
    updateSocialLinksStatus: (id: string) =>
      api.patch<ApiResponse>(`/social-links/status/${id}`),
  };
};
