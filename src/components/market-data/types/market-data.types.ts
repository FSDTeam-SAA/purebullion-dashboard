export type IntegrationCategory =
  | "All"
  | "Market Data"
  | "News Feed"
  | "AI"
  | "Payments"
  | "Email";
export type ConnectionStatus = "Active" | "Suspended";

export interface IntegrationServiceItem {
  id: string | number;
  service: string;
  provider: string;
  connection: ConnectionStatus;
  sync: string;
  dataStatus: string;
  latency: string;
  errors: string;
}

export interface MarketDataKPIs {
  connectedServices: string;
  averageLatency: string;
  errorsToday: string | number;
}

export interface GetIntegrationsParams {
  tab?: string;
  connection?: string;
  search?: string;
  page?: number;
  limit?: number;
}

