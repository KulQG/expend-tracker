import type { ExpendituresResponse, CreateExpenditureRequest, Expenditure } from "./types";

const API_BASE_URL =
  import.meta.env.VITE_PUBLIC_API_URL_EXPENDITURES || "http://localhost:8080/api/expenditures";

export const expendituresApi = {
  async getAll(page = 1, limit = 10): Promise<ExpendituresResponse> {
    const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`);

    if (!response.ok) {
      throw await response.json();
    }

    return response.json();
  },

  async create(data: CreateExpenditureRequest): Promise<Expenditure> {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw await response.json();
    }

    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw await response.json();
    }
  },
};