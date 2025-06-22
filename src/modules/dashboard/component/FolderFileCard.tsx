import React from "react";
import { Checkbox, Typography, Tooltip, Flex, Dropdown } from "antd";
import {
  FolderOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FileOutlined,
  FileZipOutlined,
  FileWordOutlined,
  FilePptOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  CloudOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  LockOutlined,
  SyncOutlined,
  DatabaseOutlined,
  CodeOutlined,
  FileMarkdownOutlined,
  FileUnknownOutlined,
  PictureOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MenuProps } from "antd/lib";

interface FileCardProps {
  id: number;
  name: string;
  type: string;
  size?: string;
  createdBy?: string;
  createdAt?: string;
  isSelected?: boolean;
  showCheckbox?: boolean;
  syncStatus?: "online" | "offline" | "syncing" | "error" | "shared" | "locked";
  onCheckboxChange?: (id: number, type: string, checked: boolean) => void;
  onClick?: (type: string, id: number) => void;
  handleDownload?: () => void;
}

const FolderFileCard: React.FC<FileCardProps> = ({
  id,
  name,
  type,
  createdBy,
  createdAt,
  size,
  isSelected = false,
  showCheckbox = true,
  syncStatus,
  onCheckboxChange,
  onClick,
  handleDownload,
}) => {
  // Comprehensive file extension to icon and color mapping
  const getFileIcon = (fileName: string, fileType: string) => {
    if (fileType === "folder") {
      return <FolderOutlined className="text-xl text-blue-600" />;
    }

    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      // A
      case "ai":
        return <FileImageOutlined className="text-xl text-orange-600" />;
      case "accdb":
      case "mdb":
        return <DatabaseOutlined className="text-xl text-purple-600" />;
      case "avi":
        return <VideoCameraOutlined className="text-xl text-red-600" />;
      // B
      case "bmp":
        return <FileImageOutlined className="text-xl text-purple-600" />;
      // C
      case "css":
      case "cs":
      case "cpp":
      case "c":
        return <CodeOutlined className="text-xl text-blue-700" />;
      case "csv":
        return <FileExcelOutlined className="text-xl text-green-600" />;
      // D
      case "doc":
      case "docx":
        return <FileWordOutlined className="text-xl text-blue-700" />;
      case "dwg":
        return <FileUnknownOutlined className="text-xl text-gray-600" />;
      // E
      case "exe":
        return <FileOutlined className="text-xl text-gray-600" />;
      case "eml":
        return <FileTextOutlined className="text-xl text-blue-600" />;
      // F
      case "flv":
        return <VideoCameraOutlined className="text-xl text-red-600" />;
      // G
      case "gif":
        return <FileImageOutlined className="text-xl text-purple-600" />;
      // H
      case "html":
      case "htm":
        return <CodeOutlined className="text-xl text-orange-600" />;
      // I
      case "iso":
        return <FileOutlined className="text-xl text-gray-600" />;
      case "indd":
        return <FileImageOutlined className="text-xl text-orange-600" />;
      // J
      case "jpg":
      case "jpeg":
        return <PictureOutlined className="text-xl text-purple-600" />;
      case "json":
        return <CodeOutlined className="text-xl text-orange-600" />;
      // K
      case "key":
        return <FilePptOutlined className="text-xl text-orange-600" />;
      // L
      case "log":
        return <FileTextOutlined className="text-xl text-gray-600" />;
      // M
      case "mp3":
        return <AudioOutlined className="text-xl text-blue-600" />;
      case "mp4":
      case "mov":
      case "mpeg":
        return <VideoCameraOutlined className="text-xl text-red-600" />;
      case "md":
        return <FileMarkdownOutlined className="text-xl text-blue-700" />;
      // N
      case "notebook":
        return <FileTextOutlined className="text-xl text-purple-600" />;
      // O
      case "odp":
        return <FilePptOutlined className="text-xl text-orange-600" />;
      case "ods":
        return <FileExcelOutlined className="text-xl text-green-600" />;
      case "odt":
        return <FileWordOutlined className="text-xl text-blue-700" />;
      // P
      case "pdf":
        return <FilePdfOutlined className="text-xl text-red-600" />;
      case "png":
        return <PictureOutlined className="text-xl text-purple-600" />;
      case "ppt":
      case "pptx":
        return <FilePptOutlined className="text-xl text-orange-600" />;
      case "psd":
        return <FileImageOutlined className="text-xl text-orange-600" />;
      // Q
      case "qt":
        return <VideoCameraOutlined className="text-xl text-red-600" />;
      // R
      case "rar":
        return <FileZipOutlined className="text-xl text-yellow-600" />;
      case "rtf":
        return <FileTextOutlined className="text-xl text-blue-700" />;
      // S
      case "svg":
        return <FileImageOutlined className="text-xl text-purple-600" />;
      case "sql":
        return <DatabaseOutlined className="text-xl text-blue-600" />;
      // T
      case "txt":
        return <FileTextOutlined className="text-xl text-blue-700" />;
      // U
      case "url":
        return <FileAddOutlined className="text-xl text-blue-600" />;
      // V
      case "vsd":
      case "vsdx":
        return <FileOutlined className="text-xl text-blue-600" />;
      // W
      case "wav":
        return <AudioOutlined className="text-xl text-blue-600" />;
      case "wmv":
        return <VideoCameraOutlined className="text-xl text-red-600" />;
      // X
      case "xlsx":
      case "xls":
        return <FileExcelOutlined className="text-xl text-green-600" />;
      case "xml":
        return <CodeOutlined className="text-xl text-orange-600" />;
      // Y
      case "yaml":
      case "yml":
        return <CodeOutlined className="text-xl text-orange-600" />;
      // Z
      case "zip":
        return <FileZipOutlined className="text-xl text-yellow-600" />;
      default:
        return <FileUnknownOutlined className="text-xl text-gray-600" />;
    }
  };

  // Map file extensions to label colors
  const getFileLabelColor = (fileName: string, fileType: string) => {
    if (fileType === "folder") return "text-blue-600";
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "ai":
      case "indd":
      case "psd":
      case "html":
      case "json":
      case "xml":
      case "yaml":
      case "yml":
      case "ppt":
      case "pptx":
      case "odp":
      case "key":
        return "text-orange-600";
      case "accdb":
      case "mdb":
      case "bmp":
      case "gif":
      case "jpg":
      case "jpeg":
      case "png":
      case "svg":
      case "notebook":
        return "text-purple-600";
      case "css":
      case "cs":
      case "cpp":
      case "c":
      case "doc":
      case "docx":
      case "odt":
      case "txt":
      case "rtf":
      case "md":
        return "text-blue-700";
      case "csv":
      case "xlsx":
      case "xls":
      case "ods":
        return "text-green-600";
      case "avi":
      case "flv":
      case "mp4":
      case "mov":
      case "mpeg":
      case "qt":
      case "wmv":
      case "pdf":
        return "text-red-600";
      case "mp3":
      case "wav":
      case "sql":
      case "vsd":
      case "vsdx":
      case "eml":
      case "url":
        return "text-blue-600";
      case "rar":
      case "zip":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  // Get sync status icon
  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case "online":
        return (
          <CloudOutlined
            className="text-xs text-blue-500 absolute bottom-0 right-0"
            style={{ fontSize: "8px" }}
          />
        );
      case "offline":
        return (
          <CheckCircleOutlined
            className="text-xs text-green-500 absolute bottom-0 right-0"
            style={{ fontSize: "8px" }}
          />
        );
      case "syncing":
        return (
          <SyncOutlined
            spin
            className="text-xs text-blue-500 absolute bottom-0 right-0"
            style={{ fontSize: "8px" }}
          />
        );
      case "error":
        return (
          <CloseCircleOutlined
            className="text-xs text-red-500 absolute bottom-0 right-0"
            style={{ fontSize: "8px" }}
          />
        );
      case "shared":
        return (
          <UserOutlined
            className="text-xs text-blue-500 absolute bottom-0 right-0"
            style={{ fontSize: "8px" }}
          />
        );
      case "locked":
        return (
          <LockOutlined
            className="text-xs text-gray-500 absolute bottom-0 right-0"
            style={{ fontSize: "8px" }}
          />
        );
      default:
        return null;
    }
  };

  // Format date to OneDrive-like format (e.g., "Oct 10, 2025")
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Truncate long file names
  const truncateName = (fileName: string, maxLength: number = 16) => {
    if (fileName.length <= maxLength) return fileName;
    const extensionMatch = fileName.match(/\.([^.]+)$/);
    const extension = extensionMatch ? `.${extensionMatch[1]}` : "";
    const nameWithoutExtension = extensionMatch
      ? fileName.slice(0, -extension.length)
      : fileName;
    const availableLength = maxLength - extension.length - 3;
    if (availableLength <= 0) return fileName.slice(0, maxLength) + "...";
    return nameWithoutExtension.slice(0, availableLength) + "..." + extension;
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <small onClick={() => onClick?.(type, id)}>Open</small>,
    },
    {
      key: "2",
      label: <small onClick={handleDownload}>Download</small>,
    },
    {
      key: "3",
      label: <small>Rename</small>,
    },
    {
      key: "4",
      label: <small>Delete</small>,
      danger: true,
    },
  ];

  return (
    <div
      className={`relative group transition-all duration-100 rounded-lg shadow-md p-2 ${
        isSelected ? "bg-blue-50" : "bg-white hover:bg-gray-50"
      }`}
      onClick={() => onClick?.(type, id)}
    >
      {/* Checkbox for selection */}
      <Flex justify="space-between" align="center">
        <div>
          {showCheckbox && (
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onCheckboxChange?.(id, type, e.target.checked);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-100"
                style={{ opacity: isSelected ? 1 : undefined }}
              />
            </div>
          )}
        </div>
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <Dropdown trigger={["click"]} menu={{ items }}>
            <BsThreeDotsVertical className="opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
          </Dropdown>
        </div>
      </Flex>
      <div className="flex flex-col items-center text-center space-y-1">
        {/* File/Folder Icon with Sync Status */}
        <div className="relative mb-1">
          {getFileIcon(name, type)}
          {getSyncStatusIcon()}
        </div>

        {/* File Name with Extension Label */}
        <div className="w-full">
          <Tooltip title={name}>
            <Typography.Text
              strong
              className="text-xs text-gray-800 leading-tight block"
              style={{ fontSize: "10px", fontWeight: 500 }}
            >
              {truncateName(name)}
            </Typography.Text>
          </Tooltip>
          {type !== "folder" && (
            <Typography.Text
              className={`text-[8px] font-medium block ${getFileLabelColor(
                name,
                type
              )}`}
            >
              {name.split(".").pop()?.toUpperCase() || "FILE"}
            </Typography.Text>
          )}
        </div>

        {/* Metadata */}
        <div className="w-full space-y-0.5">
          {createdBy && (
            <Typography.Text
              className="text-[8px] text-gray-500 block"
              style={{ fontSize: "8px" }}
            >
              By {truncateName(createdBy, 10)}
            </Typography.Text>
          )}
          {createdAt && (
            <Typography.Text
              className="text-[8px] text-gray-400 block"
              style={{ fontSize: "8px" }}
            >
              {formatDate(createdAt)}
            </Typography.Text>
          )}
          {size && type !== "folder" && (
            <Typography.Text
              className="text-[8px] text-gray-400 block"
              style={{ fontSize: "8px" }}
            >
              {size}
            </Typography.Text>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderFileCard;
