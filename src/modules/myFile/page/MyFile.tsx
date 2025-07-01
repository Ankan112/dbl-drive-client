import {
  DeleteOutlined,
  FileExcelOutlined,
  FileUnknownOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Modal, Pagination, Tooltip, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DownloadURL } from "../../../app/slice/baseQuery";
import { useLazyGetFileDetailsQuery } from "../../Shared/api/dashboardEndPoints";
import CommonHeader from "../../Shared/component/CommonHeader";
import FolderFileCard from "../../Shared/component/FolderFileCard";
import { useMoveToRecycleBinMutation } from "../../recycleBin/api/recycleBinEndpoint";
import { useGetMyFileListQuery } from "../api/myFileEndpoint";
import { IMyFileList, IPaginationParams } from "../types/myFileTypes";

const MyFile = () => {
  const navigate = useNavigate();
  const [parentId, setParentId] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<{
    fileIds: number[];
    folderIds: number[];
  }>({
    fileIds: [],
    folderIds: [],
  });
  const [selectAll, setSelectAll] = useState(false);

  const [fetchFileDetails] = useLazyGetFileDetailsQuery();
  const [moveToRecycle] = useMoveToRecycleBinMutation();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(40);
  const skipValue = (page - 1) * pageSize;
  const [filter, setFilter] = useState<IPaginationParams>({
    limit: Number(pageSize),
    offset: skipValue,
  });
  const handlePaginationChange = (current: number, size: number) => {
    setPage(current);
    setPageSize(size);
    setFilter({ ...filter, offset: (current - 1) * size, limit: size });
  };

  const { data } = useGetMyFileListQuery({ ...filter });

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

      // Supported for Office Viewer or Browser Viewing
      const officeViewerExtensions = ["doc", "docx", "ppt", "pptx", "xls", "xlsx"];
      const googleViewerExtensions = ["txt", "rtf", "odt"];
      const pdfExtension = "pdf";

      // Extensions not supported for viewing
      const unsupportedExtensions = [
        "exe", "mkv", "zip", "tar", "rar", "js", "bat", "cmd", "sql",
      ];

      // If unsupported, download directly
      if (unsupportedExtensions.includes(extension || "")) {
        const a = document.createElement("a");
        a.href = filePath;
        a.download = filePath.split("/").pop() || "file";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      // Open in Office Viewer
      if (officeViewerExtensions.includes(extension || "")) {
        const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(filePath)}`;
        window.open(officeViewerUrl, "_blank");
        return;
      }

      // Open in Google Docs Viewer
      if (googleViewerExtensions.includes(extension || "")) {
        const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(filePath)}`;
        window.open(googleViewerUrl, "_blank");
        return;
      }

      // Open PDF or any other directly supported format
      if (extension === pdfExtension || extension === "jpg" || extension === "png") {
        window.open(filePath, "_blank");
        return;
      }

      // Fallback: Open directly
      window.open(filePath, "_blank");

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
      const link = document.createElement("a");
      const fileName = filePath.split("/").pop() || "file";
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
      <CommonHeader
        title="My Files"
        showUploadButton
        parentId={Number(parentId)}
        onChange={(e) =>
          setFilter({ ...filter, key: e.target.value, offset: 0 })
        }
        onDateRangeChange={(_: any, e: any) =>
          setFilter({
            ...filter,
            start_date: e[0],
            end_date: e[1],
            offset: 0,
          })
        }
        onTypesChange={(e) => setFilter({ ...filter, type: e, offset: 0 })}
      />

      {/* Actions */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
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
        {(data?.count || 0) > 40 ? (
          <div className="mt-4">
            <Pagination
              size="small"
              align="end"
              pageSizeOptions={["40", "50", "100", "200"]}
              current={page}
              pageSize={pageSize}
              total={data?.count || 0}
              showTotal={(total) => `Total ${total}`}
              onChange={handlePaginationChange}
              showSizeChanger
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MyFile;
