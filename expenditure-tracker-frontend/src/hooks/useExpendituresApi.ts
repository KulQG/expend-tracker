import { useState } from "react";
import { toast } from "react-toastify";
import { expendituresApi } from "../api/expenditures.api";
import {
  type CreateExpenditureRequest,
  type ExpendituresResponse,
} from "../api/types";

const PAGINATION_LIMIT = 10;

export const useExpendituresApi = () => {
  const [expenditures, setExpenditures] = useState<
    ExpendituresResponse["items"]
  >([]);
  const [currentPage, setCurrentPage] = useState(0);

  const getNextExpenditures = async () => {
    const newItems = (
      await expendituresApi.getAll(currentPage, PAGINATION_LIMIT)
    ).items;

    setExpenditures((curItems) => [...curItems, ...newItems]);
    setCurrentPage((curPage) => curPage + 1);
  };

  const refreshExpenditures = async () => {
    const newItems = (
      await expendituresApi.getAll(1, PAGINATION_LIMIT)
    ).items;

    setExpenditures(newItems);
    setCurrentPage(1);
  };

  const deleteExpenditure = async (id: number) => {
    try {
      await expendituresApi.delete(id);
      toast.success("Карточка затрат удалена");
    } catch {
      toast.error("Произошла ошибка при удалении");
    }
  };

  const createExpenditure = async (data: CreateExpenditureRequest) => {
    try {
      const newExpenditure = await expendituresApi.create(data);
      return newExpenditure;
    } catch (error) {
      toast.error(`Произошла ошибка при создании: ${error}`);
    }
  };

  return {
    expenditures,
    getNextExpenditures,
    refreshExpenditures,
    deleteExpenditure,
    createExpenditure,
  };
};
