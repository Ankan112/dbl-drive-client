export interface ICreateFolder {
  parent_id?: number | null;
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
  files: Files[];
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
export interface Files {
  id: number;
  name: string;
  file_path: string;
  folder_id: number;
  user_id: number;
  mime_type: string;
  size: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  status: number;
}

export interface IFileAndFolderList {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  type: string;
  created_by_name: string;
  sort_order: number;
}
