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
import { useMoveToRecycleBinMutation } from "../../recycleBin/api/recycleBinEndpoint";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import RenameFolder from "./RenameFolder";

interface FileCardProps {
  id: number;
  name: string;
  type: string;
  size?: string;
  createdBy?: string;
  createdAt?: string;
  isSelected?: boolean;
  showCheckbox?: boolean;
  showThreeDot?: boolean;
  showDelete?: boolean;
  showRename?: boolean;
  syncStatus?: "online" | "offline" | "syncing" | "error" | "shared" | "locked";
  onCheckboxChange?: (id: number, type: string, checked: boolean) => void;
  onClick?: (type: string, id: number) => void;
  handleDownload?: (type: string, id: number) => void;
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
  showThreeDot = true,
  showDelete = true,
  showRename = true,
  syncStatus,
  onCheckboxChange,
  onClick,
  handleDownload,
}) => {
  const dispatch = useDispatch();

  const [moveToRecycle] = useMoveToRecycleBinMutation();
  const handleRecycleBin = ({ id, type }: { id: number; type: string }) => {
    const selectedItems = {
      fileIds: type === "file" ? [id] : [],
      folderIds: type === "folder" ? [id] : [],
    };
    moveToRecycle(selectedItems);
  };

  const getFileIcon = (fileName: string, fileType: string) => {
    if (fileType === "folder") {
      return <FolderOutlined className="text-xl text-blue-600" />;
    }
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "ai":
        return <FileImageOutlined className="text-xl text-orange-600" />;
      case "accdb":
      case "mdb":
        return <DatabaseOutlined className="text-xl text-purple-600" />;
      case "avi":
        return <VideoCameraOutlined className="text-xl text-red-600" />;
      case "bmp":
        return <FileImageOutlined className="text-xl text-purple-600" />;
      case "css":
      case "cs":
      case "cpp":
      case "c":
        return <CodeOutlined className="text-xl text-blue-700" />;
      case "csv":
        return <FileExcelOutlined className="text-xl text-green-600" />;
      case "doc":
      case "docx":
        return <FileWordOutlined className="text-xl text-blue-700" />;
      case "dwg":
        return <FileUnknownOutlined className="text-xl text-gray-600" />;
      case "exe":
        return <FileOutlined className="text-xl text-gray-600" />;
      case "eml":
        return <FileTextOutlined className="text-xl text-blue-600" />;
      case "flv":
        return <VideoCameraOutlined className="text-xl text-red-600" />;
      case "gif":
        return <FileImageOutlined className="text-xl text-purple-600" />;
      case "html":
      case "htm":
        return <CodeOutlined className="text-xl text-orange-600" />;
      case "iso":
        return <FileOutlined className="text-xl text-gray-600" />;
      case "indd":
        return <FileImageOutlined className="text-xl text-orange-600" />;
      case "jpg":
      case "jpeg":
        return <PictureOutlined className="text-xl text-purple-600" />;
      case "json":
        return <CodeOutlined className="text-xl text-orange-600" />;
      case "key":
        return <FilePptOutlined className="text-xl text-orange-600" />;
      case "log":
        return <FileTextOutlined className="text-xl text-gray-600" />;
      case "mp3":
        return <AudioOutlined className="text-xl text-blue-600" />;
      case "mkv":
      case "mp4":
      case "mov":
      case "mpeg":
        return <VideoCameraOutlined className="text-xl text-red-600" />;
      case "md":
        return <FileMarkdownOutlined className="text-xl text-blue-700" />;
      case "notebook":
        return <FileTextOutlined className="text-xl text-purple-600" />;
      case "odp":
        return <FilePptOutlined className="text-xl text-orange-600" />;
      case "ods":
        return <FileExcelOutlined className="text-xl text-green-600" />;
      case "odt":
        return <FileWordOutlined className="text-xl text-blue-700" />;
      case "pdf":
        return <FilePdfOutlined className="text-xl text-red-600" />;
      case "png":
        return <PictureOutlined className="text-xl text-purple-600" />;
      case "ppt":
      case "pptx":
        return <FilePptOutlined className="text-xl text-orange-600" />;
      case "psd":
        return <FileImageOutlined className="text-xl text-orange-600" />;
      case "qt":
        return <VideoCameraOutlined className="text-xl text-red-600" />;
      case "rar":
      case "zip":
        return <FileZipOutlined className="text-xl text-yellow-600" />;
      case "rtf":
        return <FileTextOutlined className="text-xl text-blue-700" />;
      case "svg":
        return <FileImageOutlined className="text-xl text-purple-600" />;
      case "sql":
        return <DatabaseOutlined className="text-xl text-blue-600" />;
      case "txt":
        return <FileTextOutlined className="text-xl text-blue-700" />;
      case "url":
        return <FileAddOutlined className="text-xl text-blue-600" />;
      case "vsd":
      case "vsdx":
        return <FileOutlined className="text-xl text-blue-600" />;
      case "wav":
        return <AudioOutlined className="text-xl text-blue-600" />;
      case "wmv":
        return <VideoCameraOutlined className="text-xl text-red-600" />;
      case "xlsx":
      case "xls":
        return <FileExcelOutlined className="text-xl text-green-600" />;
      case "xml":
        return <CodeOutlined className="text-xl text-orange-600" />;
      case "yaml":
      case "yml":
        return <CodeOutlined className="text-xl text-orange-600" />;
      default:
        return <FileUnknownOutlined className="text-xl text-gray-600" />;
    }
  };

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
    ...(type !== "folder"
      ? [
          {
            key: "2",
            label: (
              <small onClick={() => handleDownload?.(type, id)}>Download</small>
            ),
          },
        ]
      : []),
    ...(showRename
      ? [
          {
            key: "3",
            label: (
              <small
                onClick={() =>
                  dispatch(
                    setCommonModal({
                      title: "Rename",
                      content: <RenameFolder id={id} name={name} type={type} />,
                      show: true,
                      width: 420,
                    })
                  )
                }
              >
                Rename
              </small>
            ),
          },
        ]
      : []),
    ...(showDelete
      ? [
          {
            key: "4",
            label: (
              <small onClick={() => handleRecycleBin({ id, type })}>
                Delete
              </small>
            ),
            danger: true,
          },
        ]
      : []),
  ];

  return (
    <div
      className={`relative group transition-all duration-100 rounded-lg shadow-md p-2 ${
        isSelected ? "bg-blue-50" : "bg-white hover:bg-gray-50"
      }`}
      onClick={() => onClick?.(type, id)}
    >
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
        {showThreeDot && (
          <div
            className="flex justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            <Dropdown trigger={["click"]} menu={{ items }}>
              <BsThreeDotsVertical className="opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
            </Dropdown>
          </div>
        )}
      </Flex>
      <div className="flex flex-col items-center text-center space-y-1">
        <div className="relative mb-1">
          {getFileIcon(name, type)}
          {getSyncStatusIcon()}
        </div>
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
            <Typography.Text className={`text-[8px] font-medium block`}>
              {name.split(".").pop()?.toUpperCase() || "FILE"}
            </Typography.Text>
          )}
        </div>
        <div className="w-full space-y-0.5">
          {createdBy && (
            <Typography.Text className="text-[8px] text-gray-500 block">
              By {truncateName(createdBy, 10)}
            </Typography.Text>
          )}
          {createdAt && (
            <Typography.Text className="text-[8px] text-gray-400 block">
              {formatDate(createdAt)}
            </Typography.Text>
          )}
          {size && type !== "folder" && (
            <Typography.Text className="text-[8px] text-gray-400 block">
              {size}
            </Typography.Text>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderFileCard;
