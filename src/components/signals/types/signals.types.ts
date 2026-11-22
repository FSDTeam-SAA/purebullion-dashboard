export type SignalDirection = "Long" | "Short";
export type SignalStatus = "Active" | "Suspended" | "Archived";

export interface SignalItem {
  id: string | number;
  ticker: string;
  company: string;
  direction: SignalDirection;
  entry: string;
  target: string;
  status: SignalStatus;
  performance: string;
  source: string;
}

export interface SignalKPIs {
  activeSignals: string | number;
  targetReached: string;
  rewardRatio: string;
}

export interface GetSignalsParams {
  tab?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

