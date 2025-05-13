import api from "./api";

const grnService = {
  create: (data) => api.post("/grns", data),
  getAll: () => api.get("/grns"),
  getAllArchived: () => api.get("/grns/archived"),
  update: (id, data) => api.put(`/grns/${id}`, data),
  archive: (id) => api.put(`/grns/archive/${id}`),
  delete: (id) => api.delete(`/grns/${id}`), 
  getReport: (params) => api.get("/grns/report", { params }),
};

export default grnService;
