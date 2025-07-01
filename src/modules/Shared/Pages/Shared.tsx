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

    // Office & Google viewer supported extensions
    const officeViewerExtensions = ["doc", "docx", "ppt", "pptx", "xls", "xlsx"];
    const googleViewerExtensions = ["txt", "rtf", "odt"];
    const directViewExtensions = ["pdf", "jpg", "jpeg", "png", "gif", "mp4", "webm"];

    // File types to download
    const unsupportedExtensions = [
      "exe", "mkv", "zip", "tar", "rar", "js", "bat", "cmd", "sql",
    ];

    // ⛔️ Download unsupported files
    if (unsupportedExtensions.includes(extension || "")) {
      const a = document.createElement("a");
      a.href = filePath;
      a.download = filePath.split("/").pop() || "file";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // 📄 Office Viewer
    if (officeViewerExtensions.includes(extension || "")) {
      const officeUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(filePath)}`;
      window.open(officeUrl, "_blank");
      return;
    }

    // 📃 Google Docs Viewer
    if (googleViewerExtensions.includes(extension || "")) {
      const googleUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(filePath)}`;
      window.open(googleUrl, "_blank");
      return;
    }

    // 🖼️ Direct View
    if (directViewExtensions.includes(extension || "")) {
      window.open(filePath, "_blank");
      return;
    }

    // 🟡 Fallback — try to open directly
    window.open(filePath, "_blank");

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
    <div className="min-h-screen flex flex-col">
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
            showRename={false}
            
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
