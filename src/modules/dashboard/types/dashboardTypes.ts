export interface ICreateFolder {
  parent_id?: number;
  name: string;
}
export interface IFolderList {
  id: number;
  name: string;
  parent_id: null | number;
  created_at: string;
  updated_at: string;
  created_by_name: string;
}

export interface IFolderDetails {
  id: number;
  name: string;
  parent_id: number;
  full_path: string;
}
