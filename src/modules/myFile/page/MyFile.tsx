
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Drawer,
  Input,
  message,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useGetMyFileListQuery } from "../api/myFileEndpoint";
import { useMoveToRecycleBinMutation } from "../../recycleBin/api/recycleBinEndpoint";
import { useState, useEffect } from "react";
import { IMyFileList } from "../types/myFileTypes";
import {
  useGetFileDetailsQuery,
  useLazyGetFileDetailsQuery,
} from "../../dashboard/api/dashboardEndPoints";
import { useNavigate } from "react-router";
import FolderFileCard from "../../dashboard/component/FolderFileCard";
import { DownloadURL } from "../../../app/slice/baseQuery";
const MyFile = () => {
  const [fileId, setFileId] = useState<number>(0);
  const [isPdfViewerOpen, setPdfViewerOpen] = useState(false);
  const navigate = useNavigate();
  const { data } = useGetMyFileListQuery();
  
  const [fetchFileDetails] = useLazyGetFileDetailsQuery();

  const [moveToRecycle] = useMoveToRecycleBinMutation();

  const [selectedItems, setSelectedItems] = useState<{
    fileIds: number[];
    folderIds: number[];
  }>({
    fileIds: [],
    folderIds: [],
  });

  const [selectAll, setSelectAll] = useState(false);

  const handleCheckboxChange = (id: number, type: string, checked: boolean) => {
    setSelectedItems((prev) => {
      const key = type === "file" ? "fileIds" : "folderIds";
      const updatedIds = checked
        ? [...prev[key], id]
        : prev[key].filter((itemId) => itemId !== id);
      return {
        ...prev,
        [key]: updatedIds,
      };
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked && data?.data?.length) {
      const allFileIds = data.data
        .filter((item) => item.type === "file")
        .map((item) => item.id);
      const allFolderIds = data.data
        .filter((item) => item.type === "folder")
        .map((item) => item.id);

      setSelectedItems({
        fileIds: allFileIds,
        folderIds: allFolderIds,
      });
    } else {
      setSelectedItems({ fileIds: [], folderIds: [] });
    }
  };

  useEffect(() => {
    const totalItems = data?.data?.length || 0;
    const totalSelected =
      selectedItems.fileIds.length + selectedItems.folderIds.length;

    setSelectAll(totalSelected > 0 && totalSelected === totalItems);
  }, [selectedItems, data]);

  const handleRecycleBin = () => {
    moveToRecycle(selectedItems);
  };
  const handleCardClick = async (type: string, id: number) => {
    if (type === "folder") {
      message.warning("Folder found!");
      navigate(`/folder/${id}`);
      return;
    }

    try {
      const res = await fetchFileDetails(id); // Fetch file details manually
      const filePath = `${DownloadURL}/media/${res?.data?.data?.path_name}`;

      const fileName = res?.data?.data?.file_name;

      if (!filePath) {
        message.error("File path not found!");
        return;
      }

      const extension = filePath.split(".").pop()?.toLowerCase();

      if (extension === "pdf") {
        // Open in new tab
        message.warning("pdf found!");

        window.open(filePath, "_blank");
      } else {
        // Trigger download
        message.warning("other file found!");

        const link = document.createElement("a");
        link.href = filePath;
        link.download = fileName || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Failed to load file:", error);
      message.error("Failed to load file.");
    }
  };

  
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <Typography.Title level={4} className="!mb-0">
          My Files
        </Typography.Title>
        <Input
          className="w-64 rounded-sm border-gray-300"
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search File"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <Checkbox
          checked={selectAll}
          onChange={(e) => handleSelectAll(e.target.checked)}
        >
          Select All
        </Checkbox>

        <Tooltip title="Move to bin">
          <Button
            icon={<DeleteOutlined />}
            type="primary"
            danger
            onClick={handleRecycleBin}
            disabled={
              selectedItems.fileIds.length === 0 &&
              selectedItems.folderIds.length === 0
            }
          >
            Delete
          </Button>
        </Tooltip>
      </div>

      {/* Cards */}
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {data?.data?.map((item: IMyFileList) => {
            const isChecked =
              item.type === "file"
                ? selectedItems.fileIds.includes(item.id)
                : selectedItems.folderIds.includes(item.id);

            return (

              <FolderFileCard
                key={item.id}
                id={item.id}
                name={item.name}
                type={item.type}
                createdBy={item.created_by_name}
                createdAt={item.created_at}
                size={item.size}
                isSelected={isChecked}
                showCheckbox={true}
                onCheckboxChange={handleCheckboxChange}
                onClick={handleCardClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyFile;
