// composables/useUser.ts
export const useTechnologies = () => {
  return {
    addNewTechnologies: (body: any) =>
      api.post<ApiResponse>(`/technologies`, body),
    deleteTechnologies: (id: number) =>
      api.delete<ApiResponse>(`/technologies/${id}`),
    updateTechnologies: (id: number, body: any) =>
      api.put<ApiResponse>(`/technologies/${id}`, body),
  };
};
