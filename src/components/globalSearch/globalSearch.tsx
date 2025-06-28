import React, { useState } from "react";
import { Input, Dropdown, Menu, Spin, Typography, message, Modal } from "antd";
import {
  SearchOutlined,
  FolderOutlined,
  FileOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FileZipOutlined,
  FileWordOutlined,
  FilePptOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  DatabaseOutlined,
  CodeOutlined,
  FileMarkdownOutlined,
  FileUnknownOutlined,
  PictureOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import {
  useGetFileAndFolderListQuery,
  useLazyGetFileDetailsQuery,
} from "../../modules/dashboard/api/dashboardEndPoints";
import { DownloadURL } from "../../app/slice/baseQuery";
import { useNavigate } from "react-router";

interface IFileAndFolderList {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  type: string;
  created_by_name: string;
  sort_order: number;
}

const { Text } = Typography;

const GlobalSearch: React.FC = () => {
  const [filter, setFilter] = useState({ key: "" });
  const [visible, setVisible] = useState(false);
  const [fetchFileDetails] = useLazyGetFileDetailsQuery();
  const { data, isLoading } = useGetFileAndFolderListQuery({ ...filter });
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setFilter({ key: value });
    setVisible(value.length > 0);
  };

  const handleVisibleChange = (flag: boolean) => {
    if (!flag) {
      setFilter({ key: "" });
      setVisible(false);
    }
  };

  const handleMenuClick = async (item: IFileAndFolderList) => {
    const { type, id } = item || {};
    setVisible(false);
    setFilter({ key: "" });
    if (type === "folder") {
      navigate(`/folder/${id}`);
      return;
    }

    try {
      const res = await fetchFileDetails(id);
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
        "mkv",
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
            <FileExcelOutlined style={{ fontSize: "20px", color: "#4caf50" }} />
          ),
          content:
            "Excel files can't be opened directly in the browser. Do you want to download this file?",
          okText: "Yes, Download",
          cancelText: "No",
          centered: true,
          okButtonProps: {
            style: { backgroundColor: "#4caf50", color: "#fff" },
          },
          cancelButtonProps: {
            style: { backgroundColor: "#f44336", color: "#fff" },
          },
          onOk() {
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
        return;
      }

      // Handle unsupported files
      if (unsupportedExtensions.includes(extension || "")) {
        Modal.confirm({
          title: "Unsupported File Type",
          icon: (
            <FileUnknownOutlined
              style={{ fontSize: "20px", color: "#f44336" }}
            />
          ),
          content: `The file type .${extension} is not supported for viewing in the browser. Would you like to download it?`,
          okText: "Yes, Download",
          cancelText: "No",
          centered: true,
          okButtonProps: {
            style: { backgroundColor: "#4caf50", color: "#fff" },
          },
          cancelButtonProps: {
            style: { backgroundColor: "#f44336", color: "#fff" },
          },
          onOk() {
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
        return;
      }

      // Handle all other cases
      let urlToOpen = filePath;

      if (googleDocsExtensions.includes(extension || "")) {
        urlToOpen = `https://docs.google.com/viewer?url=${encodeURIComponent(
          filePath
        )}`;
      }

      window.open(urlToOpen, "_blank");
    } catch (error) {
      console.error("Failed to load file:", error);
      message.error("Failed to load file.");
    }
  };

  const menu = (
    <div className="glass-dropdown">
      <Menu
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '16px',
          padding: '6px',
        }}
        className="liquid-glass-menu"
      >
        {isLoading ? (
          <div className="flex justify-center items-center p-6">
            <div className="loading-spinner">
              <Spin size="default" />
            </div>
          </div>
        ) : (data?.data?.length || 0) > 0 ? (
          data?.data?.map((item: IFileAndFolderList, index: number) => (
            <Menu.Item
              key={item.id}
              className="glass-menu-item"
              onClick={() => handleMenuClick(item)}
              style={{
                animationDelay: `${index * 40}ms`,
                margin: '1px 0',
                borderRadius: '10px',
                border: 'none',
                padding: '10px',
              }}
            >
              <div className="flex items-center space-x-2">
                <div className="icon-container">
                  {getFileIcon(item?.name, item?.type)}
                </div>
                <div className="file-info">
                  <div className="file-name" title={item.name}>
                    {item.name}
                  </div>
                  <div className="file-meta">
                    Created by {item.created_by_name} • {" "}
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="hover-indicator">
                  <div className="arrow-icon">→</div>
                </div>
              </div>
            </Menu.Item>
          ))
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <Text className="no-results-text">
              No results found
            </Text>
          </div>
        )}
      </Menu>

      <style>{`
        .glass-dropdown {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 14px;
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.06),
            0 6px 15px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
          padding: 6px;
          position: relative;
          overflow: hidden;
          animation: slideIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          min-width: 280px;
          max-width: 450px;
        }

        @media (max-width: 768px) {
          .glass-dropdown {
            min-width: 240px;
            max-width: 92vw;
          }
        }

        .glass-dropdown::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.35), 
            transparent
          );
        }

        .liquid-glass-menu {
          max-height: 320px;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .liquid-glass-menu::-webkit-scrollbar {
          display: none;
        }

        .glass-menu-item {
          background: rgba(255, 255, 255, 0.08) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          animation: fadeInUp 0.4s ease-out forwards;
          opacity: 0;
          transform: translateY(15px);
          position: relative;
          overflow: hidden;
        }

        .glass-menu-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.15), 
            transparent
          );
          transition: left 0.4s ease;
        }

        .glass-menu-item:hover::before {
          left: 100%;
        }

        .glass-menu-item:hover {
          background: rgba(255, 255, 255, 0.16) !important;
          border-color: rgba(255, 255, 255, 0.25) !important;
          transform: translateY(-1px) scale(1.01);
          box-shadow: 
            0 6px 20px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }

        .icon-container {
          width: 30px;
          height: 30px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.25s ease;
          flex-shrink: 0;
        }

        @media (max-width: 480px) {
          .icon-container {
            width: 28px;
            height: 28px;
          }
        }

        .glass-menu-item:hover .icon-container {
          background: rgba(255, 255, 255, 0.16);
          transform: scale(1.08);
        }

        .file-info {
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }

        .file-name {
          font-size: 13px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
          line-height: 1.2;
        }

        @media (max-width: 480px) {
          .file-name {
            font-size: 12px;
          }
        }

        .file-meta {
          font-size: 10px;
          color: #666;
          opacity: 0.8;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
        }

        @media (max-width: 480px) {
          .file-meta {
            font-size: 9px;
          }
        }

        .hover-indicator {
          opacity: 0;
          transform: translateX(-8px);
          transition: all 0.25s ease;
          flex-shrink: 0;
          margin-left: 4px;
        }

        .glass-menu-item:hover .hover-indicator {
          opacity: 1;
          transform: translateX(0);
        }

        .arrow-icon {
          font-size: 14px;
          color: #666;
          font-weight: bold;
        }

        .no-results {
          text-align: center;
          padding: 24px 12px;
          color: #666;
        }

        .no-results-icon {
          font-size: 28px;
          margin-bottom: 8px;
          opacity: 0.5;
        }

        .no-results-text {
          font-size: 12px;
          color: #666 !important;
        }

        .loading-spinner {
          padding: 12px;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-15px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <Dropdown
          overlay={menu}
          trigger={["click"]}
          visible={visible && !!filter.key}
          onVisibleChange={handleVisibleChange}
          placement="bottomCenter"
          overlayClassName="glass-dropdown-overlay"
        >
          <div className="search-input-container">
            <Input
              prefix={
                <SearchOutlined className="search-icon" />
              }
              placeholder="Search files and folders..."
              value={filter.key}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              className="glass-search-input"
            />
            <div className="search-glow"></div>
          </div>
        </Dropdown>
      </div>

      <style>{`
        .search-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 12px;
          width: 100%;
          margin: 0;
        }

        .search-wrapper {
          position: relative;
          width: 100%;
          max-width: 450px;
          margin: 0 auto;
        }

        .search-input-container {
          position: relative;
          margin-top: -10px;
          width: 100%;
        }

        .glass-search-input {
          height: 36px !important;
          border-radius: 18px !important;
          border: 1px solid rgba(255, 255, 255, 0.18) !important;
          background: rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          font-size: 13px !important;
          padding: 0 16px !important;
          box-shadow: 
            0 6px 25px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.25) !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          color: #333 !important;
          width: 100% !important;
        }

        @media (max-width: 768px) {
          .glass-search-input {
            height: 34px !important;
            font-size: 12px !important;
            padding: 0 14px !important;
          }
          
          .search-container {
            padding: 10px;
          }
        }

        @media (max-width: 480px) {
          .glass-search-input {
            height: 32px !important;
            font-size: 12px !important;
            padding: 0 12px !important;
          }
          
          .search-container {
            padding: 8px;
          }
        }

        .glass-search-input:hover {
          border-color: rgba(255, 255, 255, 0.25) !important;
          background: rgba(255, 255, 255, 0.12) !important;
          box-shadow: 
            0 8px 30px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
        }

        .glass-search-input:focus {
          border-color: rgba(64, 158, 255, 0.4) !important;
          background: rgba(255, 255, 255, 0.16) !important;
          box-shadow: 
            0 10px 35px rgba(0, 0, 0, 0.15),
            0 0 0 3px rgba(64, 158, 255, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
        }

        .search-icon {
          color: #666 !important;
          font-size: 14px !important;
          margin-right: 4px !important;
        }

        @media (max-width: 480px) {
          .search-icon {
            font-size: 12px !important;
            margin-right: 3px !important;
          }
        }

        .search-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          border-radius: 18px;
          background: linear-gradient(45deg, 
            rgba(64, 158, 255, 0.08), 
            rgba(147, 51, 234, 0.08)
          );
          opacity: 0;
          transition: opacity 0.25s ease;
          pointer-events: none;
          z-index: -1;
        }

        .glass-search-input:focus + .search-glow {
          opacity: 1;
        }

        .glass-dropdown-overlay {
          z-index: 1050;
        }

        .glass-dropdown-overlay .ant-dropdown {
          border: none !important;
          box-shadow: none !important;
          background: transparent !important;
          width: 100%;
        }

        /* Input placeholder styling */
        .glass-search-input::placeholder {
          color: rgba(102, 102, 102, 0.6) !important;
        }

        /* Clear button styling */
        .glass-search-input .ant-input-clear-icon {
          color: #666 !important;
        }

        .glass-search-input .ant-input-clear-icon:hover {
          color: #333 !important;
        }
      `}</style>
    </div>
  );
};

export default GlobalSearch;

const getFileIcon = (fileName: string, fileType: string) => {
  if (fileType === "folder") {
    return <FolderOutlined className="text-sm text-blue-500" />;
  }
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "ai":
      return <FileImageOutlined className="text-sm text-orange-500" />;
    case "accdb":
    case "mdb":
      return <DatabaseOutlined className="text-sm text-purple-500" />;
    case "avi":
      return <VideoCameraOutlined className="text-sm text-red-500" />;
    case "bmp":
      return <FileImageOutlined className="text-sm text-purple-500" />;
    case "css":
    case "cs":
    case "cpp":
    case "c":
      return <CodeOutlined className="text-sm text-blue-600" />;
    case "csv":
      return <FileExcelOutlined className="text-sm text-green-500" />;
    case "doc":
    case "docx":
      return <FileWordOutlined className="text-sm text-blue-600" />;
    case "dwg":
      return <FileUnknownOutlined className="text-sm text-gray-500" />;
    case "exe":
      return <FileOutlined className="text-sm text-gray-500" />;
    case "eml":
      return <FileTextOutlined className="text-sm text-blue-500" />;
    case "flv":
      return <VideoCameraOutlined className="text-sm text-red-500" />;
    case "gif":
      return <FileImageOutlined className="text-sm text-purple-500" />;
    case "html":
    case "htm":
      return <CodeOutlined className="text-sm text-orange-500" />;
    case "iso":
      return <FileOutlined className="text-sm text-gray-500" />;
    case "indd":
      return <FileImageOutlined className="text-sm text-orange-500" />;
    case "jpg":
    case "jpeg":
      return <PictureOutlined className="text-sm text-purple-500" />;
    case "json":
      return <CodeOutlined className="text-sm text-orange-500" />;
    case "key":
      return <FilePptOutlined className="text-sm text-orange-500" />;
    case "log":
      return <FileTextOutlined className="text-sm text-gray-500" />;
    case "mp3":
      return <AudioOutlined className="text-sm text-blue-500" />;
    case "mkv":
    case "mp4":
    case "mov":
    case "mpeg":
      return <VideoCameraOutlined className="text-sm text-red-500" />;
    case "md":
      return <FileMarkdownOutlined className="text-sm text-blue-600" />;
    case "notebook":
      return <FileTextOutlined className="text-sm text-purple-500" />;
    case "odp":
      return <FilePptOutlined className="text-sm text-orange-500" />;
    case "ods":
      return <FileExcelOutlined className="text-sm text-green-500" />;
    case "odt":
      return <FileWordOutlined className="text-sm text-blue-600" />;
    case "pdf":
      return <FilePdfOutlined className="text-sm text-red-500" />;
    case "png":
      return <PictureOutlined className="text-sm text-purple-500" />;
    case "ppt":
    case "pptx":
      return <FilePptOutlined className="text-sm text-orange-500" />;
    case "psd":
      return <FileImageOutlined className="text-sm text-orange-500" />;
    case "qt":
      return <VideoCameraOutlined className="text-sm text-red-500" />;
    case "rar":
    case "zip":
      return <FileZipOutlined className="text-sm text-yellow-500" />;
    case "rtf":
      return <FileTextOutlined className="text-sm text-blue-600" />;
    case "svg":
      return <FileImageOutlined className="text-sm text-purple-500" />;
    case "sql":
      return <DatabaseOutlined className="text-sm text-blue-500" />;
    case "txt":
      return <FileTextOutlined className="text-sm text-blue-600" />;
    case "url":
      return <FileAddOutlined className="text-sm text-blue-500" />;
    case "vsd":
    case "vsdx":
      return <FileOutlined className="text-sm text-blue-500" />;
    case "wav":
      return <AudioOutlined className="text-sm text-blue-500" />;
    case "wmv":
      return <VideoCameraOutlined className="text-sm text-red-500" />;
    case "xlsx":
    case "xls":
      return <FileExcelOutlined className="text-sm text-green-500" />;
    case "xml":
      return <CodeOutlined className="text-sm text-orange-500" />;
    case "yaml":
    case "yml":
      return <CodeOutlined className="text-sm text-orange-500" />;
    default:
      return <FileUnknownOutlined className="text-sm text-gray-500" />;
  }
};