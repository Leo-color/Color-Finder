import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SolveResult } from '../utils/mathSolver';

const HISTORY_KEY = '@solvix_history';
const MAX_HISTORY = 100;

export interface HistoryEntry extends SolveResult {
  id: string;
  timestamp: number;
  imageUri?: string;
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from storage on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      if (raw) {
        const parsed: HistoryEntry[] = JSON.parse(raw);
        setHistory(parsed);
      }
    } catch {
      // Ignore storage errors
    } finally {
      setLoading(false);
    }
  }, []);

  const addEntry = useCallback(
    async (result: SolveResult, imageUri?: string) => {
      const entry: HistoryEntry = {
        ...result,
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        timestamp: result.timestamp ?? Date.now(),
        imageUri,
      };

      setHistory(prev => {
        const next = [entry, ...prev].slice(0, MAX_HISTORY);
        AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });

      return entry;
    },
    []
  );

  const removeEntry = useCallback(async (id: string) => {
    setHistory(prev => {
      const next = prev.filter(e => e.id !== id);
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const clearHistory = useCallback(async () => {
    await AsyncStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }, []);

  const stats = {
    totalSolved: history.length,
    todaySolved: history.filter(
      e => new Date(e.timestamp).toDateString() === new Date().toDateString()
    ).length,
    equations: history.filter(e => e.isEquation).length,
    expressions: history.filter(e => !e.isEquation).length,
  };

  return { history, loading, addEntry, removeEntry, clearHistory, stats };
}
