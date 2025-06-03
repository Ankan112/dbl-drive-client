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
  parent_id: null | number;
  full_path: string;
  next_folder: NextFolder[];
}

export interface NextFolder {
  id: number;
  name: string;
  parent_id: number;
  user_id: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  status: number;
}
