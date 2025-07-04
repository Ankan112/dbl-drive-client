import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Empty,
  Input,
  message,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { FileExcelOutlined, FileUnknownOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
import { DownloadURL } from "../../../app/slice/baseQuery";
import {
  useGetFolderDetailsQuery,
  useLazyGetFileDetailsQuery,
} from "../../Shared/api/dashboardEndPoints";
import FolderFileCard from "../../Shared/component/FolderFileCard";
import { Files, NextFolder } from "../../Shared/types/dashboardTypes";
import { useMoveToRecycleBinMutation } from "../../recycleBin/api/recycleBinEndpoint";
import CommonHeader from "../../Shared/component/CommonHeader";

const MyFileDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.replace("/my-file/", "");

  const segments = path.split("/").filter(Boolean);
  const lastFolderId = segments[segments.length - 1];
  const { data } = useGetFolderDetailsQuery(Number(lastFolderId));
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
    if (checked && data?.data) {
      const allFileIds = data.data.files?.map((item) => item.id);

      const allFolderIds = data?.data?.next_folder?.map((item) => item.id);

      setSelectedItems({
        fileIds: allFileIds,
        folderIds: allFolderIds,
      });
    } else {
      setSelectedItems({ fileIds: [], folderIds: [] });
    }
  };

  useEffect(() => {
    const totalItems =
      (data?.data?.next_folder?.length || 0) + (data?.data?.files?.length || 0);
    const totalSelected =
      selectedItems.fileIds.length + selectedItems.folderIds.length;

    setSelectAll(totalSelected > 0 && totalSelected === totalItems);
  }, [selectedItems, data?.data?.files, data?.data?.next_folder]);

  const handleRecycleBin = () => {
    moveToRecycle(selectedItems);
  };

  const handleFolderCardClick = async (type: string = "folder", id: number) => {
    navigate(`/my-file/${id}`);
    return;
  };
  const handleFileCardClick = async (type: string, id: number) => {
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

    // Office-supported formats
    const officeViewerExtensions = ["doc", "docx", "ppt", "pptx", "xls", "xlsx"];
    const googleViewerExtensions = ["txt", "rtf", "odt"];
    const directViewExtensions = ["pdf", "jpg", "jpeg", "png", "gif", "mp4", "webm"];

    // Unsupported formats that should trigger direct download
    const unsupportedExtensions = [
      "exe", "mkv", "zip", "tar", "rar", "js", "bat", "cmd", "sql",
    ];

    // Handle unsupported files: download directly
    if (unsupportedExtensions.includes(extension || "")) {
      const a = document.createElement("a");
      a.href = filePath;
      a.download = filePath.split("/").pop() || "file";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Office Viewer for docx, pptx, xlsx, etc.
    if (officeViewerExtensions.includes(extension || "")) {
      const officeUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(filePath)}`;
      window.open(officeUrl, "_blank");
      return;
    }

    // Google Docs Viewer for txt, rtf, odt
    if (googleViewerExtensions.includes(extension || "")) {
      const googleUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(filePath)}`;
      window.open(googleUrl, "_blank");
      return;
    }

    // Directly open PDFs, images, videos, etc.
    if (directViewExtensions.includes(extension || "")) {
      window.open(filePath, "_blank");
      return;
    }

    // Fallback: just try to open the file
    window.open(filePath, "_blank");

  } catch (error) {
    console.error("Failed to load file:", error);
    message.error("Failed to load file.");
  }
};


  const handleFileDownload = async (type: string, id: number) => {
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
        showUploadButton
        title="My Files"
        parentId={Number(lastFolderId)}
      />

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

      {/* ✅ Breadcrumb */}
      {data?.data?.full_path && (
        <Breadcrumb style={{ marginTop: 16 }}>
          {/* 🏠 Home Icon */}
          <Breadcrumb.Item
            onClick={() => navigate("/my-file")}
            // style={{ cursor: "pointer" }}
          >
            My Files
          </Breadcrumb.Item>

          {/* Dynamic segments from full_path */}
          {data.data.full_path.split("/").map((segment, index, arr) => {
            const fullPathUpToSegment = arr.slice(0, index + 1).join("/");
            return (
              <Breadcrumb.Item key={index}>
                {/* <a onClick={() => navigate(`/folder/${fullPathUpToSegment}`)}> */}
                {segment}
                {/* </a> */}
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      )}
      <div className={"p-6"}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {data?.data?.next_folder?.map((file: NextFolder) => {
            const isChecked = selectedItems.folderIds.includes(file.id);
            return (
              <>
                <FolderFileCard
                  key={file.id}
                  id={file.id}
                  name={file.name}
                  type={"folder"}
                  // createdBy={file.created_by_name}
                  createdAt={file.created_at}
                  // size={file.size}
                  isSelected={isChecked}
                  showCheckbox={true}
                  onCheckboxChange={handleCheckboxChange}
                  onClick={handleFolderCardClick}
                  handleDownload={handleFileDownload}
                />
              </>
            );
          })}
          {data?.data?.files?.map((file: Files) => {
            const isChecked = selectedItems.fileIds.includes(file.id);
            return (
              <>
                <FolderFileCard
                  key={file.id}
                  id={file.id}
                  name={file.name}
                  type={"file"}
                  // createdBy={file.created_by_name}
                  createdAt={file.created_at}
                  // size={file.size}
                  isSelected={isChecked}
                  showCheckbox={true}
                  onCheckboxChange={handleCheckboxChange}
                  onClick={handleFileCardClick}
                  handleDownload={handleFileDownload}
                />
              </>
            );
          })}
        </div>
        {(data?.data?.next_folder?.length === 0 ||
          data?.data?.files?.length === 0) && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "40vh",
              width: "100%",
            }}
          >
            <Empty />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFileDetails;
