// composables/useUser.ts
export const useWorkExperience = () => {
  return {
    addNewWorkExperience: (body: any) =>
      api.post<ApiResponse>(`/work-experience`, body),
    deleteWorkExperience: (id: number) =>
      api.delete<ApiResponse>(`/work-experience/${id}`),
    updateWorkExperience: (id: number, body: any) =>
      api.put<ApiResponse>(`/work-experience/${id}`, body),
  };
};
