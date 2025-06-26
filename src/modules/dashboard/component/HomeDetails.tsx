import { FileExcelOutlined, FileUnknownOutlined } from "@ant-design/icons";
import { Breadcrumb, Empty, message, Modal } from "antd";
import { useLocation, useNavigate } from "react-router";
import { DownloadURL } from "../../../app/slice/baseQuery";
import {
  useGetFolderDetailsQuery,
  useLazyGetFileDetailsQuery,
} from "../api/dashboardEndPoints";
import { Files, NextFolder } from "../types/dashboardTypes";
import CommonHeader from "./CommonHeader";
import FolderFileCard from "./FolderFileCard";

const HomeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.replace("/folder/", "");

  const segments = path.split("/").filter(Boolean);
  const lastFolderId = segments[segments.length - 1];
  const { data } = useGetFolderDetailsQuery(Number(lastFolderId));
  const [fetchFileDetails] = useLazyGetFileDetailsQuery();

  const handleFolderCardClick = async (type: string = "folder", id: number) => {
    navigate(`/folder/${id}`);
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
    <div>
      <CommonHeader
        showUploadButton
        title="Recent Files"
        parentId={Number(lastFolderId)}
      />
      {/* ✅ Breadcrumb */}
      {data?.data?.full_path && (
        <Breadcrumb style={{ marginTop: 16 }}>
          {/* 🏠 Home Icon */}
          <Breadcrumb.Item
            onClick={() => navigate("/")}
            // style={{ cursor: "pointer" }}
          >
            Home
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
                  // isSelected={isChecked}
                  showCheckbox={false}
                  // onCheckboxChange={handleCheckboxChange}
                  onClick={handleFolderCardClick}
                  handleDownload={handleFileDownload}
                  showDelete={false}
                  showRename={false}
                />
              </>
            );
          })}
          {data?.data?.files?.map((file: Files) => {
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
                  // isSelected={isChecked}
                  showCheckbox={false}
                  // onCheckboxChange={handleCheckboxChange}
                  onClick={handleFileCardClick}
                  handleDownload={handleFileDownload}
                  showDelete={false}
                  showRename={false}
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

export default HomeDetails;
