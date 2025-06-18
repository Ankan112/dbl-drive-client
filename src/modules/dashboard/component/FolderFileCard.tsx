import React from "react";
import { Card, Checkbox, Typography, Tag } from "antd";
import {
  FolderOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FileOutlined,
} from "@ant-design/icons";

interface FileCardProps {
  id: number;
  name: string;
  type: string;
  createdBy?: string;
  createdAt?: string;
  isSelected?: boolean;
  showCheckbox?: boolean;
  onCheckboxChange?: (id: number, type: string, checked: boolean) => void;
  onClick?: (type: string, id: number) => void;
  //   onClick?: (id: number, type: string) => void;
}

const FolderFileCard: React.FC<FileCardProps> = ({
  id,
  name,
  type,
  createdBy,
  createdAt,
  isSelected = false,
  showCheckbox = true,
  onCheckboxChange,
  onClick,
}) => {
  const getFileIcon = (fileName: string, fileType: string) => {
    if (fileType === "folder") {
      return <FolderOutlined className="text-4xl text-blue-500" />;
    }

    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return <FilePdfOutlined className="text-4xl text-red-500" />;
      case "xlsx":
      case "xls":
        return <FileExcelOutlined className="text-4xl text-green-600" />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "svg":
        return <FileImageOutlined className="text-4xl text-purple-500" />;
      case "json":
        return <FileTextOutlined className="text-4xl text-orange-500" />;
      case "txt":
      case "doc":
      case "docx":
        return <FileTextOutlined className="text-4xl text-blue-600" />;
      default:
        return <FileOutlined className="text-4xl text-gray-500" />;
    }
  };

  const getFileTypeColor = (fileName: string, fileType: string) => {
    if (fileType === "folder") return "blue";

    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return "red";
      case "xlsx":
      case "xls":
        return "green";
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "svg":
        return "purple";
      case "json":
        return "orange";
      case "txt":
      case "doc":
      case "docx":
        return "blue";
      default:
        return "default";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncateName = (name: string, maxLength: number = 20) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  return (
    <Card
      hoverable
      className={`relative group transition-all duration-200 hover:shadow-lg border ${
        isSelected ? "border-blue-400 bg-blue-50" : "border-gray-200"
      } rounded-lg`}
      style={{ padding: "16px" }}
      onClick={() => onClick?.(type, id)}
    >
      {showCheckbox && (
        <div className="absolute top-3 right-3 z-10">
          <Checkbox
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onCheckboxChange?.(id, type, e.target.checked);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ opacity: isSelected ? 1 : undefined }}
          />
        </div>
      )}

      <div className="flex flex-col items-center text-center space-y-3">
        {/* File Icon */}
        <div className="mb-2">{getFileIcon(name, type)}</div>

        {/* File Type Tag */}
        <Tag
          color={getFileTypeColor(name, type)}
          className="text-xs font-medium px-2 py-1 rounded-full"
        >
          {type === "folder"
            ? "Folder"
            : name.split(".").pop()?.toUpperCase() || "File"}
        </Tag>

        {/* File Name */}
        <div className="w-full">
          <Typography.Text
            strong
            className="text-sm text-gray-800 leading-tight block"
            title={name}
          >
            {truncateName(name)}
          </Typography.Text>
        </div>

        {/* Metadata */}
        <div className="w-full space-y-1">
          {createdBy && (
            <Typography.Text className="text-xs text-gray-500 block">
              By {createdBy}
            </Typography.Text>
          )}
          {createdAt && (
            <Typography.Text className="text-xs text-gray-400 block">
              {formatDate(createdAt)}
            </Typography.Text>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FolderFileCard;
