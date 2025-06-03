import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "../../../app/api/userApi";
import { RootState } from "../../../app/store/store";

import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Dropdown,
  Menu,
  Checkbox,
  Progress,
  Modal,
  Flex,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  MoreOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  SortAscendingOutlined,
  FilterOutlined,
  CloudUploadOutlined,
  FolderAddOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined,
  FileOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FormOutlined,
  LinkOutlined,
  FolderOpenOutlined,
  CheckCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { setCommonModal } from "../../../app/slice/modalSlice";
import CreateFolder from "../component/CreateFolder";
import {
  useGetFileAndFolderListQuery,
  useGetFolderListQuery,
  useUploadFilesMutation,
} from "../api/dashboardEndPoints";
import { Outlet, useLocation, useNavigate } from "react-router";
import { MenuProps } from "antd/lib";

const FILES = [
  {
    id: 1,
    name: "Financial Report Q2 2025.docx",
    modified: "6/1/2025 3:42 PM",
    modifiedBy: "John Doe",
    size: "2.3 MB",
    type: "docx",
    shared: false,
    isFolder: false,
  },
  {
    id: 2,
    name: "Brand Assets",
    modified: "5/28/2025 2:30 PM",
    modifiedBy: "Jane Smith",
    size: "",
    type: "folder",
    shared: true,
    isFolder: true,
    itemCount: 24,
  },
  {
    id: 3,
    name: "Product Launch Presentation.pptx",
    modified: "5/20/2025 8:45 AM",
    modifiedBy: "Alex Lee",
    size: "12.7 MB",
    type: "pptx",
    shared: true,
    isFolder: false,
  },
  {
    id: 4,
    name: "Sales Data Analytics.xlsx",
    modified: "5/25/2025 11:15 AM",
    modifiedBy: "Maria Garcia",
    size: "890 KB",
    type: "xlsx",
    shared: false,
    isFolder: false,
  },
  {
    id: 5,
    name: "Meeting Notes",
    modified: "5/29/2025 3:00 PM",
    modifiedBy: "Ethan Green",
    size: "",
    type: "folder",
    shared: false,
    isFolder: true,
    itemCount: 8,
  },
  {
    id: 6,
    name: "Company Logo.png",
    modified: "5/15/2025 1:20 PM",
    modifiedBy: "Design Team",
    size: "256 KB",
    type: "png",
    shared: true,
    isFolder: false,
  },
];

const createIcon = (color: string, letter?: string) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    className={letter ? "" : "text-blue-600"}
  >
    {letter ? (
      <>
        <rect width="16" height="16" rx="2" fill={color} />
        <path d="M4 4h8v8H4V4z" fill="white" />
        <text
          x="8"
          y="9"
          textAnchor="middle"
          fontSize="6"
          fill={color}
          fontWeight="bold"
        >
          {letter}
        </text>
      </>
    ) : (
      <path
        fill="currentColor"
        d="M1.5 2A1.5 1.5 0 000 3.5v9A1.5 1.5 0 001.5 14h13a1.5 1.5 0 001.5-1.5v-8A1.5 1.5 0 0014.5 3H8.621a1.5 1.5 0 01-1.06-.44L6.44 1.44A1.5 1.5 0 005.378 1H1.5z"
      />
    )}
  </svg>
);

const ICONS = {
  folder: createIcon("", ""),
  docx: createIcon("#2B579A", "W"),
  xlsx: createIcon("#217346", "X"),
  pptx: createIcon("#D24726", "P"),
  png: (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <rect width="16" height="16" rx="2" fill="#8B5CF6" />
      <path d="M4 4h8v8H4V4z" fill="white" />
      <circle cx="8" cy="8" r="2" fill="#8B5CF6" />
    </svg>
  ),
};
const handleClick = (key: string) => () => {
  console.log(key);
};
const actionMenu = (
  <Menu className="w-48">
    {[
      { key: "open", icon: <EyeOutlined />, text: "Open" },
      { key: "copy", icon: <CopyOutlined />, text: "Copy link" },
      { key: "download", icon: <DownloadOutlined />, text: "Download" },
      { key: "rename", icon: <EditOutlined />, text: "Rename" },
      { key: "divider", isDivider: true },
      {
        key: "delete",
        icon: <DeleteOutlined />,
        text: "Delete",
        className: "text-red-600",
      },
    ].map((item) =>
      item.isDivider ? (
        <Menu.Divider key={item.key} />
      ) : (
        <Menu.Item key={item.key} icon={item.icon} className={item.className}>
          <div onClick={handleClick(item.key)}>{item.text}</div>
        </Menu.Item>
      )
    )}
  </Menu>
);

const sortMenu = (
  <Menu>
    {["Name", "Modified", "Size", "Type"].map((item) => (
      <Menu.Item key={item.toLowerCase()}>{item}</Menu.Item>
    ))}
  </Menu>
);

const uploadMenu = (handleMenuClick: (key: string) => void) => (
  <Menu className="w-56" onClick={({ key }) => handleMenuClick(key)}>
    {[
      {
        key: "folder",
        icon: <FolderAddOutlined className="text-blue-500" />,
        text: "Folder",
      },
      { key: "divider1", isDivider: true },
      {
        key: "files",
        icon: <CloudUploadOutlined className="text-gray-500" />,
        text: "Files upload",
      },
      {
        key: "folder-upload",
        icon: <FolderOpenOutlined className="text-gray-500" />,
        text: "Folder upload",
      },
      { key: "divider2", isDivider: true },
      {
        key: "word",
        icon: <FileWordOutlined className="text-blue-600" />,
        text: "Word document",
      },
      {
        key: "excel",
        icon: <FileExcelOutlined className="text-green-600" />,
        text: "Excel workbook",
      },
      {
        key: "powerpoint",
        icon: <FilePptOutlined className="text-red-600" />,
        text: "PowerPoint presentation",
      },
      {
        key: "onenote",
        icon: <FileOutlined className="text-purple-600" />,
        text: "OneNote notebook",
      },
      {
        key: "forms",
        icon: <FormOutlined className="text-green-500" />,
        text: "Forms survey",
      },
      {
        key: "visio",
        icon: <FileOutlined className="text-blue-500" />,
        text: "Visio drawing",
      },
      { key: "divider3", isDivider: true },
      {
        key: "link",
        icon: <LinkOutlined className="text-gray-500" />,
        text: "Link",
      },
    ].map((item) =>
      item.isDivider ? (
        <Menu.Divider key={item.key} />
      ) : (
        <Menu.Item key={item.key} icon={item.icon} className="py-2">
          <span className="text-sm">{item.text}</span>
        </Menu.Item>
      )
    )}
  </Menu>
);

const Icon = ({ type, isFolder }: { type: string; isFolder: boolean }) =>
  isFolder ? ICONS.folder : ICONS[type as keyof typeof ICONS] || ICONS.docx;

const ActionButton = ({ show }: { show?: boolean }) => (
  <Dropdown overlay={actionMenu} trigger={["click"]} placement="bottomRight">
    <Button
      type="text"
      icon={<MoreOutlined />}
      className={`h-6 w-6 ${
        show ? "opacity-100" : "opacity-0"
      } hover:opacity-100 transition-opacity`}
    />
  </Dropdown>
);

export const FileItem = ({ file, isSelected, onSelect, viewMode }: any) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const commonProps = {
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
  };

  if (viewMode === "list") {
    return (
      <div
        onClick={() =>
          file.type === "folder" ? navigate(`/folder/${file.id}`) : ""
        }
        className={`grid grid-cols-12 gap-4 items-center px-6 py-2 hover:bg-gray-50 border-b border-gray-100 ${
          isSelected ? "bg-blue-50" : ""
        }`}
        {...commonProps}
      >
        <Checkbox
          className="col-span-1"
          checked={isSelected}
          onChange={onSelect}
        />
        <div className="col-span-5 flex items-center gap-3 min-w-0">
          <DeleteOutlined />

          <Icon type={file.type} isFolder={file.isFolder} />
          <div className="min-w-0 flex-1">
            <div className="text-sm text-gray-900 truncate hover:text-blue-600 cursor-pointer">
              {file.name}
            </div>
            {file.isFolder && file.itemCount && (
              <div className="text-xs text-gray-500">
                {file.itemCount} items
              </div>
            )}
          </div>
          <ActionButton show={show} />
        </div>
        {[file.modified, file.modifiedBy, file.size].map((text, i) => (
          <div
            key={i}
            className={`col-span-${[2, 2, 1][i]} text-sm text-gray-600 ${
              i === 1 ? "truncate" : ""
            }`}
          >
            {text}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      onClick={() =>
        file.type === "folder" ? navigate(`/folder/${file.id}`) : ""
      }
      className={`relative p-3 rounded border hover:border-blue-300 hover:shadow-sm cursor-pointer ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
      }`}
    >
      {/* <Checkbox
        className="absolute top-2 left-2"
        checked={isSelected}
        onChange={onSelect}
      /> */}
      {/* <div className="absolute top-2 right-2">
        <ActionButton />
      </div> */}
      <Flex justify="end" gap={6}>
        <div>
          <DownloadOutlined style={{ color: "blue" }} />
        </div>
        <div>
          <Popconfirm
            title="Are you sure you want to delete this file?"
            onConfirm={() => {}}
          >
            <DeleteOutlined style={{ color: "red" }} />
          </Popconfirm>
        </div>
      </Flex>
      <div className="flex flex-col items-center text-center mt-4">
        <div className="mb-2 scale-150">
          <Icon type={file.type} isFolder={file.isFolder} />
        </div>
        <div
          className="text-sm text-gray-900 truncate w-full mb-1"
          title={file.name}
        >
          {file.name}
        </div>
        <div className="text-xs text-gray-500">
          {file.isFolder && file.itemCount
            ? `${file.itemCount} items`
            : file.size}
        </div>
      </div>
    </div>
  );
};

const DashboardCards = () => {
  const { roleId } = useSelector((state: RootState) => state.userSlice);

  const { data: profile } = useGetMeQuery();
  const dispatch = useDispatch();
  const location = useLocation();
  const { data } = useGetFileAndFolderListQuery();
  const [upload] = useUploadFilesMutation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [parentId, setParentId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState<
    Array<{
      id: string;
      name: string;
      size: string;
      progress: number;
      status: "uploading" | "completed" | "error";
    }>
  >([]);
  console.log(uploadingFiles);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const simulateUpload = (file: File) => {
    const fileId =
      Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const uploadFile = {
      id: fileId,
      name: file.name,
      size: formatFileSize(file.size),
      progress: 0,
      status: "uploading" as const,
    };

    setUploadingFiles((prev) => [...prev, uploadFile]);
    setShowUploadModal(true);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadingFiles((prev) =>
        prev.map((f) => {
          if (f.id === fileId && f.status === "uploading") {
            const newProgress = Math.min(
              f.progress + Math.random() * 15 + 5,
              100
            );
            const newStatus = newProgress >= 100 ? "completed" : "uploading";
            return {
              ...f,
              progress: Math.round(newProgress),
              status: newStatus,
            };
          }
          return f;
        })
      );
    }, 200);

    // Stop simulation when complete
    setTimeout(() => {
      clearInterval(interval);
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, progress: 100, status: "completed" } : f
        )
      );
    }, 3000 + Math.random() * 2000);
  };

  const handleFileUpload = (accept: string, multiple: boolean = false) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = multiple;

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;

      if (files && files.length > 0) {
        const formData = new FormData();
        if (parentId) {
          formData.append("folder_id", parentId.toString());
        }
        // Append each file individually
        Array.from(files).forEach((file) => {
          formData.append("files", file); // Use "files[]" if backend expects array
          simulateUpload(file); // Optional UI simulation
        });

        upload(formData).then((res) => {
          console.log(res);
        });
      }
    };

    input.click();
  };

  const handleFolderUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.webkitdirectory = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach((file) => {
          simulateUpload(file);
        });
      }
    };
    input.click();
  };

  const removeUploadFile = (id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAllUploads = () => {
    setUploadingFiles([]);
    setShowUploadModal(false);
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setParentId(null);
    }
  }, [location.pathname]);

  const handleMenuClick = (key: string) => {
    switch (key) {
      case "folder":
        dispatch(
          setCommonModal({
            title: "New Folder",
            content: <CreateFolder parentId={parentId} />,
            show: true,
            width: 420,
          })
        );
        break;
      case "files":
        handleFileUpload("*/*", true);
        break;
      case "folder-upload":
        handleFolderUpload();
        break;
      case "word":
        handleFileUpload(
          ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        break;
      case "excel":
        handleFileUpload(
          ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        break;
      case "powerpoint":
        handleFileUpload(
          ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        );
        break;
      case "onenote":
        handleFileUpload(".one,.onetoc2");
        break;
      case "forms":
        // Handle forms creation
        console.log("Create new form");
        break;
      case "visio":
        handleFileUpload(".vsd,.vsdx,application/vnd.visio");
        break;
      case "folder":
        // Handle new folder creation
        console.log("Create new folder");
        break;
      case "link":
        // Handle link creation
        console.log("Create new link");
        break;
      default:
        break;
    }
  };

  const filteredFiles = data?.data?.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSelectItem = (id: number) =>
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  const handleSelectAll = (checked: boolean) =>
    setSelectedItems(checked ? filteredFiles!.map((f) => f.id) : []);

  const viewButtons = [
    { mode: "list", Icon: UnorderedListOutlined },
    { mode: "grid", Icon: AppstoreOutlined },
  ];
  console.log(filteredFiles);
  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">Recent Files</h1>
          <div className="flex items-center gap-2">
            <Dropdown
              overlay={uploadMenu(handleMenuClick)}
              trigger={["click"]}
              placement="bottomLeft"
            >
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                className="bg-blue-600 hover:bg-blue-700 border-blue-600 rounded-sm h-8"
              >
                Upload
              </Button>
            </Dropdown>
            {/* <Button
              icon={<FolderAddOutlined />}
              className="h-8 rounded-sm border-gray-300"
            >
              New folder
            </Button> */}
          </div>
        </div>
        <Input
          className="w-64 rounded-sm border-gray-300"
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search By File Or Person Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-6 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Dropdown overlay={sortMenu} trigger={["click"]}>
            <Button
              icon={<SortAscendingOutlined />}
              className="h-8 rounded-sm border-gray-300 text-sm"
            >
              Sort
            </Button>
          </Dropdown>
          <Button
            icon={<FilterOutlined />}
            className="h-8 rounded-sm border-gray-300 text-sm"
          >
            Filter
          </Button>
        </div>
        <div className="flex border border-gray-300 rounded-sm">
          {viewButtons.map(({ mode, Icon }, i) => (
            <Button
              key={mode}
              icon={<Icon />}
              className={`h-8 rounded-none border-0 ${
                i === 1 ? "border-l border-gray-300" : ""
              } ${viewMode === mode ? "bg-blue-100 text-blue-600" : ""}`}
              onClick={() => setViewMode(mode as any)}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {viewMode === "list" && (
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-6 py-2">
            <div className="grid grid-cols-12 gap-4 items-center text-xs font-medium text-gray-600 uppercase tracking-wider">
              <Checkbox
                className="col-span-1"
                checked={
                  selectedItems.length === filteredFiles?.length &&
                  filteredFiles.length > 0
                }
                indeterminate={
                  selectedItems.length > 0 &&
                  selectedItems.length < filteredFiles?.length!
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              {["Name", "Modified", "Modified By", "Size", ""].map(
                (header, i) => (
                  <div key={i} className={`col-span-${[5, 2, 2, 1, 1][i]}`}>
                    {header}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        <Outlet
          context={{
            searchTerm,
            viewMode,
            filteredFiles,
            handleSelectItem,
            setParentId,
          }}
        />

        {filteredFiles?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <SearchOutlined className="text-4xl mb-4" />
            <p>No items match your search</p>
          </div>
        )}
      </div>

      {/* Footer
      <div className="px-6 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
        {selectedItems.length > 0
          ? `${selectedItems.length} item${
              selectedItems.length !== 1 ? "s" : ""
            } selected`
          : `${filteredFiles?.length} item${
              filteredFiles?.length !== 1 ? "s" : ""
            }`}
      </div> */}

      {/* Upload Progress Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Uploading files</span>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={clearAllUploads}
              className="text-gray-400 hover:text-gray-600"
            />
          </div>
        }
        open={showUploadModal}
        footer={null}
        closable={false}
        width={480}
        className="upload-modal"
      >
        <div className="max-h-96 overflow-y-auto">
          {uploadingFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex-shrink-0">
                {file.status === "completed" ? (
                  <CheckCircleOutlined className="text-green-500 text-lg" />
                ) : file.status === "error" ? (
                  <CloseOutlined className="text-red-500 text-lg" />
                ) : (
                  <CloudUploadOutlined className="text-blue-500 text-lg" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {file.size}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    percent={file.progress}
                    size="small"
                    status={
                      file.status === "error"
                        ? "exception"
                        : file.status === "completed"
                        ? "success"
                        : "active"
                    }
                    showInfo={false}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 min-w-[2.5rem] text-right">
                    {file.status === "completed"
                      ? "Done"
                      : file.status === "error"
                      ? "Error"
                      : `${file.progress}%`}
                  </span>
                </div>
              </div>
              <Button
                type="text"
                icon={<CloseOutlined />}
                size="small"
                onClick={() => removeUploadFile(file.id)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              />
            </div>
          ))}
        </div>
        {uploadingFiles.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {uploadingFiles.filter((f) => f.status === "completed").length}{" "}
                of {uploadingFiles.length} files uploaded
              </span>
              <Button
                type="link"
                onClick={clearAllUploads}
                className="text-blue-600 p-0 h-auto"
              >
                Clear all
              </Button>
            </div>
          </div>
        )}
        {uploadingFiles.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {uploadingFiles.filter((f) => f.status === "completed").length}{" "}
                of {uploadingFiles.length} files uploaded
              </span>
              <Button
                type="link"
                onClick={clearAllUploads}
                className="text-blue-600 p-0 h-auto"
              ></Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DashboardCards;
