export interface IRecycleBinList {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  type: string;
  created_by_name: string;
  sort_order: number;
}
export interface IRecycleBin {
  folderIds: number[];
  fileIds: number[];
}
