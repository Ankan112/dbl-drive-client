import React from "react";
import { Checkbox, Typography, Tooltip, Flex, Dropdown, Button } from "antd";
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
  EyeOutlined,
  ArrowDownOutlined,
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
            className="text-xs text-blue-500 absolute -bottom-1 -right-1"
            style={{ fontSize: "8px" }}
          />
        );
      case "offline":
        return (
          <CheckCircleOutlined
            className="text-xs text-green-500 absolute -bottom-1 -right-1"
            style={{ fontSize: "8px" }}
          />
        );
      case "syncing":
        return (
          <SyncOutlined
            spin
            className="text-xs text-blue-500 absolute -bottom-1 -right-1"
            style={{ fontSize: "8px" }}
          />
        );
      case "error":
        return (
          <CloseCircleOutlined
            className="text-xs text-red-500 absolute -bottom-1 -right-1"
            style={{ fontSize: "8px" }}
          />
        );
      case "shared":
        return (
          <UserOutlined
            className="text-xs text-blue-500 absolute -bottom-1 -right-1"
            style={{ fontSize: "8px" }}
          />
        );
      case "locked":
        return (
          <LockOutlined
            className="text-xs text-gray-500 absolute -bottom-1 -right-1"
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
      className={`relative group transition-all duration-300 rounded-xl shadow-md hover:shadow-xl overflow-hidden h-36 ${isSelected ? "bg-blue-50 ring-2 ring-blue-200" : "bg-white hover:bg-gray-50"
        }`}
    >
      {/* Fixed height container with improved hover animation */}
      <div className="h-full flex flex-col cursor-pointer relative" onClick={() => onClick?.(type, id)}>

        {/* Header Controls - Always visible area */}
        <div className="absolute top-2 left-2 right-2 z-10">
          <Flex justify="space-between" align="flex-start">
            <div className="flex-shrink-0">
              {showCheckbox && (
                <div onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      onCheckboxChange?.(id, type, e.target.checked);
                    }}


                    className={`transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                  />
                </div>
              )}
            </div>
            {showThreeDot && (
              <div
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <Dropdown trigger={["click"]} menu={{ items }}>
                  <Button
                    type="text"
                    size="small"
                    icon={<BsThreeDotsVertical />}
                    className="text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-full backdrop-blur-sm"
                  />
                </Dropdown>
              </div>
            )}
          </Flex>
        </div>

        {/* Main Content - No upward movement on hover */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">

          {/* Icon Container */}
          <div className="relative mb-2">
            <div className="p-2 rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors duration-300 group-hover:scale-110">
              {getFileIcon(name, type)}
            </div>
            {getSyncStatusIcon()}
          </div>

          {/* File Info */}
          <div className="w-full space-y-1">
            <Tooltip title={name}>
              <Typography.Text
                strong
                className="text-xs text-gray-800 leading-tight block"
                style={{ fontSize: "11px", fontWeight: 600 }}
              >
                {truncateName(name, 18)}
              </Typography.Text>
            </Tooltip>

            {type !== "folder" && (
              <Typography.Text className="text-[8px] font-medium text-blue-600 uppercase tracking-wider">
                {name.split(".").pop()?.toUpperCase() || "FILE"}
              </Typography.Text>
            )}

            {/* Metadata - More compact */}
            <div className="space-y-0.5 mt-1">
              {createdBy && (
                <Typography.Text className="text-[8px] text-gray-500 block">
                  By {truncateName(createdBy, 12)}
                </Typography.Text>
              )}
              {createdAt && (
                <Typography.Text className="text-[8px] писано от AI text-gray-400 block">
                  {formatDate(createdAt)}
                </Typography.Text>
              )}
              {size && type !== "folder" && (
                <Typography.Text className="text-[8px] text-gray-400 block font-medium">
                  {size}
                </Typography.Text>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - Slide up from bottom */}
        <div className="absolute bottom-0 left-0 right-0 min-h-[52px] bg-gradient-to-t from-white/40 via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-full group-hover:translate-y-0">
          <div className="flex justify-center items-center py-3 gap-2 bg-white/30 backdrop-blur-lg border-none rounded-b-xl shadow">
            <Tooltip title="View">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined className="text-blue-600" />}
                className="flex items-center justify-center hover:bg-blue-100/20 rounded-full w-[28px] h-[28px] transition-all duration-200 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.(type, id);
                }}
              />
            </Tooltip>
            {type !== "folder" && (
              <Tooltip title="Download">
                <Button
                  type="text"
                  size="small"
                  icon={<ArrowDownOutlined className="text-green-600" />}
                  className="flex items-center justify-center hover:bg-green-100/20 rounded-full w-[28px] h-[28px] transition-all duration-200 hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload?.(type, id);
                  }}
                />
              </Tooltip>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default FolderFileCard;