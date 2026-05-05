import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import { API_URL } from "./constants";
import {
  BaseRecord,
  DataProvider,
  GetListParams,
  GetListResponse,
} from "@refinedev/core";
import { MOCK_SUBJECTS } from "@/constants/mock-data";
export const { kyInstance } = createSimpleRestDataProvider({
  apiURL: API_URL,
});

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({
    resource,
    filters,
    pagination,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== "subjects") {
      return { data: [] as TData[], total: 0 };
    }

    let filteredData = [...MOCK_SUBJECTS];

    // Apply filters
    if (filters) {
      for (const filter of filters) {
        if ("field" in filter && filter.field && filter.value) {
          filteredData = filteredData.filter((item) => {
            const fieldValue = item[filter.field as keyof typeof item];
            if (filter.operator === "eq") {
              return fieldValue === filter.value;
            }
            if (
              filter.operator === "contains" &&
              typeof fieldValue === "string"
            ) {
              return fieldValue
                .toLowerCase()
                .includes(String(filter.value).toLowerCase());
            }
            return true;
          });
        }
      }
    }

    const total = filteredData.length;

    // Apply pagination
    if (pagination?.currentPage && pagination?.pageSize) {
      const start = (pagination.currentPage - 1) * pagination.pageSize;
      filteredData = filteredData.slice(start, start + pagination.pageSize);
    }
    return {
      data: filteredData as unknown as TData[],
      total,
    };
  },
  getOne: async () => {
    throw new Error("This function is not available in mock");
  },
  create: async () => {
    throw new Error("This function is not available in mock");
  },
  update: async () => {
    throw new Error("This function is not available in mock");
  },
  deleteOne: async () => {
    throw new Error("This function is not available in mock");
  },
  getApiUrl: () => "",
};
