export interface IMyFileList {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  type: string;
  size: string;
  created_by_name: string;
  sort_order: number;
}
export interface IPaginationParams {
  limit?: number;
  offset?: number;
  key?: string;
  start_date?: string;
  end_date?: string;
}
