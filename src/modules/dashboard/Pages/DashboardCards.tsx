import { useSelector } from "react-redux";
import { useGetMeQuery } from "../../../app/api/userApi";
import { RootState } from "../../../app/store/store";
import {
  useGetAllDashboardQuery,
  useGetDashboardAssetDataForAdminQuery,
  useGetDashboardDistributedAssetDataForAdminQuery,
  useGetDashboardEmployeeDataForEmployeeQuery,
} from "../api/dashboardEndPoints";
import { useState } from "react";
import { Button, Col, DatePicker, Input, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const DashboardCards = () => {
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  const { data: asset } = useGetDashboardAssetDataForAdminQuery({});
  const { data: distributedAsset } =
    useGetDashboardDistributedAssetDataForAdminQuery({});
  const { data: empData } = useGetDashboardEmployeeDataForEmployeeQuery({});
  const { data } = useGetAllDashboardQuery();
  console.log(empData);
  const { data: profile } = useGetMeQuery();
  const {
    total_assign_asset,
    employee_id,
    department,
    designation,
    email,
    contact_no,
    joining_date,
    unit_name,
    status,
    role_id,
  } = profile?.data || {};

  const dummyFiles = [
    {
      name: "Document 1.docx",
      owner: "John Doe",
      lastModified: "May 30, 2025 10:00 AM",
      activity: "Edited 2 days ago",
      type: "Word",
      icon: "📄", // Word icon
      location: "My Files", // Location (My Files)
    },
    {
      name: "Photo_2025.jpg",
      owner: "Jane Smith",
      lastModified: "May 28, 2025 02:30 PM",
      activity: "Uploaded 5 days ago",
      type: "Image",
      icon: "📸", // Image icon
      location: "Shared", // Location (Shared)
    },
    {
      name: "Presentation.pptx",
      owner: "Alex Lee",
      lastModified: "May 20, 2025 08:45 AM",
      activity: "Shared 3 days ago",
      type: "PowerPoint",
      icon: "📊", // PowerPoint icon
      location: "My Files", // Location (My Files)
    },
    {
      name: "Spreadsheet.xlsx",
      owner: "Maria Garcia",
      lastModified: "May 25, 2025 11:15 AM",
      activity: "Edited 1 day ago",
      type: "Excel",
      icon: "📊", // Excel icon
      location: "Shared", // Location (Shared)
    },
    {
      name: "Notes.txt",
      owner: "Ethan Green",
      lastModified: "May 29, 2025 03:00 PM",
      activity: "Uploaded 4 days ago",
      type: "Text",
      icon: "📝", // Text icon
      location: "My Files", // Location (My Files)
    },
  ];
  const [fileTypeFilter, setFileTypeFilter] = useState("All");

  const filteredFiles =
    fileTypeFilter === "All"
      ? dummyFiles
      : dummyFiles.filter((file) => file.type === fileTypeFilter);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Recent Files</h1>

      {/* File Type Filter - styled as rounded pill buttons */}
      <Row className="mb-4 ">
        <Col className="flex space-x-4" xs={24} sm={24} md={24} lg={8} xl={12}>
          <FilterButton
            selected={fileTypeFilter === "All"}
            onClick={() => setFileTypeFilter("All")}
            icon="📂"
            label="All Files"
          />
          <FilterButton
            selected={fileTypeFilter === "Word"}
            onClick={() => setFileTypeFilter("Word")}
            icon="📄"
            label="Word"
          />
          <FilterButton
            selected={fileTypeFilter === "Excel"}
            onClick={() => setFileTypeFilter("Excel")}
            icon="📊"
            label="Excel"
          />
          <FilterButton
            selected={fileTypeFilter === "PowerPoint"}
            onClick={() => setFileTypeFilter("PowerPoint")}
            icon="📊"
            label="PowerPoint"
          />
          <FilterButton
            selected={fileTypeFilter === "Image"}
            onClick={() => setFileTypeFilter("Image")}
            icon="📸"
            label="Images"
          />
          <FilterButton
            selected={fileTypeFilter === "Text"}
            onClick={() => setFileTypeFilter("Text")}
            icon="📝"
            label="Text"
          />
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={8}
          xl={12}
          className="flex justify-end space-x-3"
        >
          <DatePicker.RangePicker
            style={{ borderRadius: "20px" }}
            width={200}
          />
          <div className="w-[200px]">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              style={{ borderRadius: "20px" }}
            />
          </div>
        </Col>
      </Row>

      {/* Table Headers */}
      <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-gray-500 mb-2">
        <div className="truncate">Name</div>
        <div className="truncate">Owner</div>
        <div className="truncate">Date Modified</div>
        <div className="truncate">Activity</div>
        <div className="truncate">Location</div>
      </div>

      {/* Files Grid */}
      <div className="space-y-4">
        {filteredFiles.map((file, index) => (
          <FileRow key={index} file={file} />
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;
function FilterButton({
  selected,
  onClick,
  icon,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <Button
      className={`${
        selected ? "bg-[#0078D4] text-white" : "bg-white text-gray-700"
      } py-2 px-4 rounded-full transition duration-200 flex items-center space-x-2`}
      onClick={onClick}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Button>
  );
}

function FileRow({ file }: { file: any }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="grid grid-cols-5 items-center p-4 hover:bg-gray-300 hover:rounded-lg  transition duration-200 relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* File Icon */}
      <div className="flex items-center space-x-2">
        <span className="text-lg">{file.icon}</span>
        <div className="text-sm font-medium truncate">{file.name}</div>
      </div>

      {/* Owner */}
      <div className="text-sm text-gray-600">{file.owner}</div>

      {/* Date Modified */}
      <div className="text-sm text-gray-500">{file.lastModified}</div>

      {/* Activity */}
      <div className="text-sm text-gray-400">{file.activity}</div>

      {/* Location under the file name */}
      <div className="text-sm text-gray-500">{file.location}</div>

      {/* Actions - Three dots visible only on hover */}
      {/* {showActions && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <Button className="text-xs p-1">
            <span className="text-lg">⋮</span>
          </Button>
        </div>
      )} */}
    </div>
  );
}
