// composables/useUser.ts
export const useUser = () => {
  return {
    addNewUser: (body: any) => api.post<ApiResponse>(`/user`, body),
    updateUser: (id: number, body: any) =>
      api.put<ApiResponse>(`/user/${id}`, body),
    getListUser: (params: { search?: string; page?: number; limit?: number }) =>
      api.get<ApiResponse>(`/user`, { query: params }),
  };
};
