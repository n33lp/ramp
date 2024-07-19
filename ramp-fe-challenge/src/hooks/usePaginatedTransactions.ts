import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

// Bug 4
export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch();
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<Transaction[]> | null>(null);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState<boolean>(true);  // Ensure it's typed as boolean


  const fetchAll = useCallback(async () => {
    if (!isMoreDataAvailable) return;  // Prevent fetching when no more data is available

    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions?.nextPage ?? 0,
      }
    );

    setPaginatedTransactions((previousResponse) => {
      if (response === null) {
        return previousResponse;
      }

      const hasMoreData = response.nextPage !== undefined && response.nextPage !== null; // Check if more pages exist
      setIsMoreDataAvailable(hasMoreData);  // Update pagination completion state

      if (previousResponse === null) {
        return response;
      }

      return { 
        data: [...previousResponse.data, ...response.data], 
        nextPage: response.nextPage 
      };
    });
  }, [fetchWithCache, paginatedTransactions, isMoreDataAvailable]);

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null);
    setIsMoreDataAvailable(true);  // Reset the pagination state
  }, []);

  return { data: paginatedTransactions, loading, fetchAll, invalidateData, isMoreDataAvailable };
}
