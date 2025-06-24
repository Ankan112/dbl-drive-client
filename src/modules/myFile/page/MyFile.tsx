import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, message, Tooltip, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DownloadURL } from "../../../app/slice/baseQuery";
import { useLazyGetFileDetailsQuery } from "../../dashboard/api/dashboardEndPoints";
import FolderFileCard from "../../dashboard/component/FolderFileCard";
import { useMoveToRecycleBinMutation } from "../../recycleBin/api/recycleBinEndpoint";
import { useGetMyFileListQuery } from "../api/myFileEndpoint";
import { IMyFileList } from "../types/myFileTypes";
import CommonHeader from "../../dashboard/component/CommonHeader";
const MyFile = () => {
  const navigate = useNavigate();
  const { data } = useGetMyFileListQuery();
  const [parentId, setParentId] = useState<number | null>(null);
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

  useEffect(() => {
    if (location.pathname === "/") {
      setParentId(null);
    }
  }, [location.pathname]);

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
      navigate(`/my-file/${id}`);
      return;
    }

    try {
      const res = await fetchFileDetails(id); // Fetch file details manually
      const filePath = `${DownloadURL}/media/${res?.data?.data?.path_name}`;

      if (!filePath) {
        message.error("File path not found!");
        return;
      }

      const extension = filePath.split(".").pop()?.toLowerCase();

      // List of extensions that should open in Google Docs
      const googleDocsExtensions = [
        'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'
      ];

      let urlToOpen = filePath;

      if (googleDocsExtensions.includes(extension || '')) {
        // Convert file URL to Google Docs viewer URL
        urlToOpen = `https://docs.google.com/viewer?url=${encodeURIComponent(filePath)}`;
      }

      // Open all files in new tab
      window.open(urlToOpen, "_blank");

    } catch (error) {
      console.error("Failed to load file:", error);
      message.error("Failed to load file.");
    }
  };

  const handleDownload = async (type: string, id: number) => {
    if (type === "folder") {
      navigate(`/my-file/${id}`);
      return;
    }

    try {
      const res = await fetchFileDetails(id); // Fetch file details manually
      const filePath = `${DownloadURL}/media/${res?.data?.data?.path_name}`;

      if (!filePath) {
        message.error("File path not found!");
        return;
      }

      // Fetch the file as a Blob
      const response = await fetch(filePath);
      const blob = await response.blob();
      const extension = filePath.split(".").pop()?.toLowerCase();

      // Create a download link
      const link = document.createElement('a');
      const fileName = filePath.split('/').pop() || 'file';
      link.href = URL.createObjectURL(blob);
      link.download = fileName;

      // Force download for all file types, even PDFs, videos, etc.
      link.click();

      // Clean up the object URL after download
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Failed to load file:", error);
      message.error("Failed to load file.");
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <CommonHeader title="My Files" parentId={Number(parentId)} />

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
      <div>
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
                handleDownload={handleDownload}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyFile;
