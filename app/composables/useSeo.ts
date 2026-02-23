// composables/useUser.ts
export const useSeo = () => {
  return {
    addNewSeo: (body: any) => api.post<ApiResponse>(`/seo`, body),
    updateSeo: (id: string, body: any) =>
      api.put<ApiResponse>(`/seo/${id}`, body),
    deleteSeo: (id: string) => api.delete<ApiResponse>(`/seo/${id}`),
  };
};
