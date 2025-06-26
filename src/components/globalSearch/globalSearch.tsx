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

  const menu = (
    <Menu
      style={{
        width: 350,
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      }}
      className="max-h-[40vh] overflow-y-auto scrollbar-hide"
    >
      {isLoading ? (
        <div className="flex justify-center p-4">
          <Spin size="small" />
        </div>
      ) : (data?.data?.length || 0) > 0 ? (
        data?.data?.map((item: IFileAndFolderList) => (
          <Menu.Item
            key={item.id}
            className="hover:bg-gray-50 transition-colors duration-150 py-3"
            onClick={() => handleMenuClick(item)}
          >
            <div className="flex items-center space-x-3">
              {getFileIcon(item?.name, item?.type)}
              <div className="flex-1 min-w-0">
                <Text strong className="block text-sm text-gray-900 truncate">
                  {item.name}
                </Text>
                <Text type="secondary" className="text-xs">
                  Created by {item.created_by_name} on{" "}
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </div>
            </div>
          </Menu.Item>
        ))
      ) : (
        <Menu.Item className="text-center p-4">
          <Text type="secondary" className="text-sm">
            No results found
          </Text>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className="relative flex justify-center">
      <Dropdown
        overlay={menu}
        trigger={["click"]}
        visible={visible && !!filter.key}
        onVisibleChange={handleVisibleChange}
        // overlayStyle={{ width: 330 }}
        placement="bottomCenter"
      >
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search files and folders..."
          value={filter.key}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          className="rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          style={{
            height: 35,
            width: 370,
            fontSize: 14,
            backgroundColor: "#fff",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          }}
        />
      </Dropdown>
    </div>
  );
};

export default GlobalSearch;

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
