import { message } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { DownloadURL } from "../../../app/slice/baseQuery";
import {
  useGetFileAndFolderListQuery,
  useLazyGetFileDetailsQuery,
} from "../api/dashboardEndPoints";
import CommonHeader from "../component/CommonHeader";
import FolderFileCard from "../component/FolderFileCard";

const Home = () => {
  const location = useLocation();
  const { data } = useGetFileAndFolderListQuery();
  const [parentId, setParentId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [fetchFileDetails] = useLazyGetFileDetailsQuery();

  useEffect(() => {
    if (location.pathname === "/") {
      setParentId(null);
    }
  }, [location.pathname]);

  const filteredFiles = data?.data?.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = async (type: string, id: number) => {
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
      const googleDocsExtensions = [
        'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'
      ];

      let urlToOpen = filePath;

      if (googleDocsExtensions.includes(extension || '')) {
        // Convert file URL to Google Docs viewer URL
        urlToOpen = `https://docs.google.com/viewer?url=${encodeURIComponent(filePath)}`;
      }

      // Open all files in new tab
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
      const link = document.createElement('a');
      const fileName = filePath.split('/').pop() || 'file';
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
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <CommonHeader title="Recent Files" parentId={parentId} />
      {/* Content */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {filteredFiles?.map((item) => (
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
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
