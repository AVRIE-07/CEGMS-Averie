import api from "./api";

const supplierService = {
  create: (data) => api.post("/suppliers", data),
  get: (id) => api.get(`/supplier/${id}`),
  getAll: () => api.get("/suppliers"),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

export default supplierService;
