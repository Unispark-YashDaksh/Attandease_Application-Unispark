import { useState, useCallback } from "react";

export default function usePullToRefresh(fetchFn) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchFn();
    } catch (err) {
      console.log("Pull to refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  }, [fetchFn]);

  return { refreshing, onRefresh };
}
