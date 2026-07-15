import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useCallback } from "react";
import { useState } from "react";
import api from "../services/api";

export default function useTodayLogs() {
  const [todayRecords, setTodayRecords] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTodayLogs = useCallback(async () => {
    setLoading(true);
    try {
      const employeeId = await AsyncStorage.getItem("employee_id");
      if (!employeeId) return;
      const res = await api.post("/attendance", { employee_id: employeeId });
      setTodayRecords(res.data.record);
    } catch (err) {
      console.log("useTodayLogs error", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayLogs();
  }, [fetchTodayLogs]);

  return { todayRecords, loading, refetch: fetchTodayLogs };
}