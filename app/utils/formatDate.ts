export const formatDate = (dateString: string | Date) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
