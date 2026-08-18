import axios from "axios";

const API_URL = "https://skillgraph-ai-vifh.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDevelopers = async () => {
  const response = await api.get("/api/developers");
  return response.data;
};

export const getDeveloperSkills = async (name) => {
  const response = await api.get(
    `/api/developers/${encodeURIComponent(name)}`
  );

  return response.data;
};

export const getDeveloperTechnologies = async (name) => {
  const response = await api.get(
    `/api/developer-technologies/${encodeURIComponent(name)}`
  );

  return response.data;
};

export const getRecommendations = async (name) => {
  const response = await api.get(
    `/api/recommendations/${encodeURIComponent(name)}`
  );

  return response.data;
};

export const getJobRoles = async () => {
  const response = await api.get("/api/job-roles");
  return response.data;
};

export default api;