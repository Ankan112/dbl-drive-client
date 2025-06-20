import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Empty, message } from "antd";
import { useLocation, useNavigate } from "react-router";
import { DownloadURL } from "../../../app/slice/baseQuery";
import {
  useGetFolderDetailsQuery,
  useLazyGetFileDetailsQuery,
} from "../api/dashboardEndPoints";
import { Files, NextFolder } from "../types/dashboardTypes";
import FolderFileCard from "./FolderFileCard";
import CommonHeader from "./CommonHeader";

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
  const handleFileCardClick = async (type: string = "file", id: number) => {
    try {
      const res = await fetchFileDetails(id); // Fetch file details manually
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

  return (
    <div>
      <CommonHeader title="Recent Files" parentId={Number(lastFolderId)} />
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
