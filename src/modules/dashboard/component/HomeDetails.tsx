import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router";
import { useGetFolderDetailsQuery } from "../api/dashboardEndPoints";
import {
  Breadcrumb,
  Card,
  Col,
  Empty,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { FileItem } from "../Pages/Dashboard";
import { Files, NextFolder } from "../types/dashboardTypes";
import { HomeOutlined } from "@ant-design/icons";
import { useEffect } from "react";

const HomeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get the path after `/folder/`
  const path = location.pathname.replace("/folder/", "");

  // Get the last segment (last folder UID)
  const segments = path.split("/").filter(Boolean);
  const lastFolderId = segments[segments.length - 1];
  const { data, isLoading } = useGetFolderDetailsQuery(Number(lastFolderId));

  const { viewMode, handleSelectItem, setParentId } = useOutletContext<{
    searchTerm: string;
    viewMode: "grid" | "list";
    handleSelectItem: (id: number) => void;
    setParentId: (id: number | null) => void;
  }>();

  useEffect(() => {
    if (lastFolderId) {
      setParentId(Number(lastFolderId));
    }
  }, [lastFolderId]);

  return (
    <div>
      {/* ✅ Breadcrumb */}
      {data?.data?.full_path && (
        <Breadcrumb style={{ marginTop: 16 }}>
          {/* 🏠 Home Icon */}
          <Breadcrumb.Item
            onClick={() => navigate("/")}
            // style={{ cursor: "pointer" }}
          >
            <HomeOutlined />
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
      <div className={viewMode === "grid" ? "p-6" : ""}>
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4"
              : ""
          }
        >
          {data?.data?.next_folder?.map((file: NextFolder) => (
            // <FileItem
            //   key={file.id}
            //   file={file}
            //   viewMode={viewMode}

            //   //   isSelected={selectedItems.includes(file.id)}
            //   onSelect={() => handleSelectItem(file.id)}
            // />
            <Card
              key={file.id}
              hoverable
              className="relative shadow-md rounded-lg text-center p-2 cursor-pointer"
              style={{ padding: "12px" }}
              onClick={() => navigate(`/folder/${file.id}`)}
            >
              {/* <div
                className="absolute top-2 right-2 z-10"
                onClick={(e) => e.stopPropagation()} // prevent card click
              >
                <Checkbox
                  checked={isChecked}
                  onChange={(e) =>
                    handleCheckboxChange(file.id, file.type, e.target.checked)
                  }
                />
              </div> */}

              <Space direction="vertical" size={4} align="center">
                <Tag color={"green"} style={{ textTransform: "capitalize" }}>
                  Folder
                </Tag>
                <Typography.Text strong>{file.name}</Typography.Text>
              </Space>
            </Card>
          ))}
          {data?.data?.files?.map((file: Files) => (
            <FileItem
              key={file.id}
              file={file}
              viewMode={viewMode}
              //   isSelected={selectedItems.includes(file.id)}
              onSelect={() => handleSelectItem(file.id)}
            />
          ))}
        </div>
        {data?.data?.next_folder?.length === 0 && (
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
