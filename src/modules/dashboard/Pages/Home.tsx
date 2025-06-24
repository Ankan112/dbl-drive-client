import { message, Pagination } from "antd";
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

      const fileName = res?.data?.data?.file_name;

      if (!filePath) {
        message.error("File path not found!");
        return;
      }

      const extension = filePath.split(".").pop()?.toLowerCase();

      if (extension === "pdf") {
        // Open in new tab
        message.warning("pdf found!");

        window.open(filePath, "_blank");
      } else {
        // Trigger download

        const link = document.createElement("a");
        link.href = filePath;
        link.download = fileName || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Failed to load file:", error);
      message.error("Failed to load file.");
    }
  };

  const handleDownload = () => {
    alert("Download");
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <CommonHeader
        title="Recent Files"
        showUploadButton
        parentId={parentId}
        onChange={(e) =>
          setFilter({ ...filter, key: e.target.value, offset: 0 })
        }
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
