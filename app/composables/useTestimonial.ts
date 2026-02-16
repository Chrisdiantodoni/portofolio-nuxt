// composables/useUser.ts
export const useTestimonial = () => {
  return {
    addNewTestimonial: (body: any) =>
      api.post<ApiResponse>(`/testimonial`, body),
    deleteTestimonial: (id: number) =>
      api.delete<ApiResponse>(`/testimonial/${id}`),
    updateTestimonial: (id: number, body: any) =>
      api.put<ApiResponse>(`/testimonial/${id}`, body),
  };
};
