export type AlertStatus = "Delivered" | "Suspended" | "Failed";

export interface AlertItem {
  id: string | number;
  recipient: string;
  message: string;
  category: string;
  status: AlertStatus;
  sent: string;
  delivered: number;
  read: number;
}

export interface AlertsKPIs {
  deliveredToday: string | number;
  readRate: string;
  failed: string | number;
}

export interface NotificationTemplateItem {
  id: string;
  title: string;
  content: string;
  category: string;
}

export interface GetAlertsParams {
  tab?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

