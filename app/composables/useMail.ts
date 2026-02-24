// composables/useUser.ts
export const useMail = () => {
  return {
    moveToArchive: (id: number) =>
      api.patch<ApiResponse>(`/mails/${id}/archive`),
    moveToDraftWithId: (id: number, body: any) =>
      api.post<ApiResponse>(`/mails/${id}/draft`, body),
    moveToTrash: (id: any) => api.patch<ApiResponse>(`/mails/${id}/trash`),
    readMail: (id: number) => api.patch(`/mails/${id}/read`),
    moveToDraft: (body: any) => api.post<ApiResponse>(`/mails/`, body),
    sentMail: (body: any) => api.post(`/mails/sent`, body),
  };
};
