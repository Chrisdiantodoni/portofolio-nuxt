// composables/useUser.ts
export const useProject = () => {
  return {
    addNewProject: (body: any) => api.post<ApiResponse>(`/project`, body),
    updateProject: (id: string, body: any) =>
      api.put<ApiResponse>(`/project/${id}`, body),
    updateProjectStatus: (id: string) =>
      api.patch<ApiResponse>(`/project/status/${id}`),
    deleteProjects: (id: string) => api.delete<ApiResponse>(`/project/${id}`),
  };
};
