// composables/useUser.ts
export const useFaq = () => {
  return {
    addNewFaq: (body: any) => api.post<ApiResponse>(`/faqs`, body),
    deleteFaq: (id: number) => api.delete<ApiResponse>(`/faqs/${id}`),
    updateFaq: (id: number, body: any) =>
      api.put<ApiResponse>(`/faqs/${id}`, body),
  };
};
