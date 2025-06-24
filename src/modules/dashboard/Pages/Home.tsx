import { message, Pagination, Modal } from "antd";
import { FileExcelOutlined, FileUnknownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { DownloadURL } from "../../../app/slice/baseQuery";
import {
  useGetFileAndFolderListQuery,
  useLazyGetFileDetailsQuery,
} from "../api/dashboardEndPoints";
import CommonHeader from "../component/CommonHeader";
import FolderFileCard from "../component/FolderFileCard";
import { IPaginationParams } from "../../myFile/types/myFileTypes";

const Home = () => {
  const location = useLocation();
  const [parentId, setParentId] = useState<number | null>(null);
  const navigate = useNavigate();
  const [fetchFileDetails] = useLazyGetFileDetailsQuery();

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
  const { data } = useGetFileAndFolderListQuery({ ...filter });
  useEffect(() => {
    if (location.pathname === "/") {
      setParentId(null);
    }
  }, [location.pathname]);

  const handleCardClick = async (type: string, id: number) => {
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <CommonHeader
        title="Recent Files"
        showUploadButton
        parentId={parentId}
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
      {/* Content */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {data?.data?.map((item) => (
          <FolderFileCard
            key={item.id}
            id={item.id}
            name={item.name}
            type={item.type}
            createdBy={item.created_by_name}
            createdAt={item.created_at}
            // size={item.size}
            // isSelected={isChecked}
            showCheckbox={false}
            // onCheckboxChange={handleCheckboxChange}
            onClick={handleCardClick}
            handleDownload={handleDownload}
            showDelete={false}
          />
        ))}
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
  );
};
export default Home;
