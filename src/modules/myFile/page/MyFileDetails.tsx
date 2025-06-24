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
} from "../../dashboard/api/dashboardEndPoints";
import FolderFileCard from "../../dashboard/component/FolderFileCard";
import { Files, NextFolder } from "../../dashboard/types/dashboardTypes";
import { useMoveToRecycleBinMutation } from "../../recycleBin/api/recycleBinEndpoint";
import CommonHeader from "../../dashboard/component/CommonHeader";

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

      // List of extensions that should open in Google Docs
      const googleDocsExtensions = ["doc", "docx", "ppt", "pptx", "txt", "rtf"];

      // List of Excel formats we want to confirm + download
      const excelExtensions = ["xls", "xlsx"];

      // List of unsupported formats that should trigger direct download
      const unsupportedExtensions = [
        "exe",
        "zip",
        "tar",
        "rar",
        "js",
        "bat",
        "cmd",
        "sql",
      ];

      // Handle Excel files: show confirmation modal for download
      if (excelExtensions.includes(extension || "")) {
        Modal.confirm({
          title: "Download Excel File",
          icon: (
            <FileExcelOutlined style={{ fontSize: "24px", color: "#4caf50" }} />
          ), // Excel icon
          content:
            "Excel files can't be opened directly in the browser. Do you want to download this file?",
          okText: "Yes, Download",
          cancelText: "No",
          centered: true, // Center the modal
          okButtonProps: {
            style: { backgroundColor: "#4caf50", color: "#fff" }, // Green button
          },
          cancelButtonProps: {
            style: { backgroundColor: "#f44336", color: "#fff" }, // Red button
          },
          onOk() {
            // Trigger download
            const a = document.createElement("a");
            a.href = filePath;
            a.download = filePath.split("/").pop() || "file.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          },
          onCancel() {
            console.log("Download canceled");
          },
        });
        return; // Stop further processing
      }

      // Handle unsupported files (e.g., .exe, .zip, .sql)
      if (unsupportedExtensions.includes(extension || "")) {
        Modal.confirm({
          title: "Unsupported File Type",
          icon: (
            <FileUnknownOutlined
              style={{ fontSize: "24px", color: "#f44336" }}
            />
          ), // Unknown file icon
          content: `The file type .${extension} is not supported for viewing in the browser. Would you like to download it?`,
          okText: "Yes, Download",
          cancelText: "No",
          centered: true, // Center the modal
          okButtonProps: {
            style: { backgroundColor: "#4caf50", color: "#fff" }, // Green button
          },
          cancelButtonProps: {
            style: { backgroundColor: "#f44336", color: "#fff" }, // Red button
          },
          onOk() {
            // Trigger download for unsupported files
            const a = document.createElement("a");
            a.href = filePath;
            a.download = filePath.split("/").pop() || "file";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          },
          onCancel() {
            console.log("Download canceled");
          },
        });
        return; // Stop further processing
      }

      // Handle all other cases: Open in browser (Google Docs Viewer or other formats)
      let urlToOpen = filePath;

      if (googleDocsExtensions.includes(extension || "")) {
        // Convert file URL to Google Docs viewer URL
        urlToOpen = `https://docs.google.com/viewer?url=${encodeURIComponent(
          filePath
        )}`;
      }

      // Open all other files in a new tab
      window.open(urlToOpen, "_blank");
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
