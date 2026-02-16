// composables/useUser.ts
export const useArticle = () => {
  return {
    addNewArticle: (body: any) => api.post<ApiResponse>(`/articles`, body),
    deleteArticle: (id: number) => api.delete<ApiResponse>(`/articles/${id}`),
    updateArticle: (id: number, body?: any) =>
      api.put<ApiResponse>(`/articles/${id}`, body),
    updateArticleStatus: (id: number) =>
      api.patch<ApiResponse>(`/articles/status/${id}`),
  };
};
