import {
  CheckCircleOutlined,
  CloseOutlined,
  CloudUploadOutlined,
  FileExcelOutlined,
  FileOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileWordOutlined,
  FolderAddOutlined,
  FolderOpenOutlined,
  SearchOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Dropdown,
  Input,
  Menu,
  Progress,
  Select,
  Space,
  notification,
} from "antd";
import { setCommonModal } from "../../../app/slice/modalSlice";
import CreateFolder from "./CreateFolder";
import { useDispatch } from "react-redux";
import { useUploadFilesMutation } from "../api/dashboardEndPoints";
import { rangePreset } from "../../../common/rangePreset/rangePreset";

interface Props {
  title: string;
  parentId?: number | null;
  onChange?: (value: any) => void;
  onDateRangeChange?: (value: any, values: any) => void;
  onTypesChange?: (value: any) => void;
  showUploadButton?: boolean;
}

const CommonHeader = ({
  title,
  parentId,
  onChange,
  onDateRangeChange,
  onTypesChange,
  showUploadButton,
}: Props) => {
  const [upload] = useUploadFilesMutation();
  const dispatch = useDispatch();

  const showUploadNotification = (file: File) => {
    const key = `upload-${file.name}-${Date.now()}`;
    let progress = 0;

    const interval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 15 + 5, 100);

      notification.open({
        key,
        message: `Uploading: ${file.name}`,
        description: (
          <Progress
            percent={Math.round(progress)}
            size="small"
            showInfo={false}
            strokeColor={{
              '0%': '#4f46e5',
              '100%': '#7c3aed',
            }}
            trailColor="rgba(255, 255, 255, 0.3)"
          />
        ),
        icon: <CloudUploadOutlined style={{ color: "#4f46e5" }} />,
        duration: 0,
        placement: "bottomRight",
        closable: false,
        style: {
          background: "rgba(255, 255, 255, 0.35)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          borderRadius: "12px",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)",
        },
      });

      if (progress >= 100) {
        clearInterval(interval);

        const formData = new FormData();
        if (parentId) {
          formData.append("folder_id", parentId.toString());
        }
        formData.append("files", file);

        upload(formData)
          .unwrap()
          .then(() => {
            notification.success({
              key,
              message: `Uploaded: ${file.name}`,
              description: "File uploaded successfully.",
              icon: <CheckCircleOutlined style={{ color: "#059669" }} />,
              placement: "bottomRight",
              style: {
                background: "rgba(240, 253, 244, 0.9)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "12px",
                boxShadow: "0 16px 40px rgba(34, 197, 94, 0.15)",
              },
            });
          })
          .catch(() => {
            notification.error({
              key,
              message: `Upload failed: ${file.name}`,
              description: "Something went wrong during upload.",
              icon: <CloseOutlined style={{ color: "#dc2626" }} />,
              placement: "bottomRight",
              style: {
                background: "rgba(254, 242, 242, 0.9)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "12px",
                boxShadow: "0 16px 40px rgba(239, 68, 68, 0.15)",
              },
            });
          });
      }
    }, 200);
  };

  const handleFileUpload = (accept: string, multiple: boolean = false) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = multiple;

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        Array.from(files).forEach((file) => showUploadNotification(file));
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
        Array.from(files).forEach((file) => showUploadNotification(file));
      }
    };

    input.click();
  };

  const handleMenuClick = (key: string) => {
    switch (key) {
      case "files":
        handleFileUpload("*/*", true);
        break;
      case "folder-upload":
        handleFolderUpload();
        break;
      case "word":
        handleFileUpload(".doc,.docx");
        break;
      case "excel":
        handleFileUpload(".xls,.xlsx");
        break;
      case "pdf":
        handleFileUpload(".pdf");
        break;
      case "powerpoint":
        handleFileUpload(".ppt,.pptx");
        break;
      default:
        dispatch(
          setCommonModal({
            title: "New Folder",
            content: <CreateFolder parentId={parentId} />,
            show: true,
            width: 420,
          })
        );
        break;
    }
  };

  const uploadMenu = (
    <Menu 
      onClick={({ key }) => handleMenuClick(key)}
      style={{
        background: "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "14px",
        padding: "8px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08)",
        minWidth: "200px",
      }}
    >
      <Menu.Item
        key="files"
        icon={<CloudUploadOutlined style={{ color: "#4f46e5", fontSize: "15px" }} />}
        style={{
          borderRadius: "10px",
          margin: "2px 0",
          fontSize: "14px",
          height: "36px",
          lineHeight: "36px",
          fontWeight: "500",
          color: "#374151",
          transition: "all 0.2s ease",
        }}
      >
        Upload Files
      </Menu.Item>
      <Menu.Divider style={{ 
        margin: "6px 0", 
        background: "rgba(107, 114, 128, 0.2)",
        height: "1px",
        border: "none"
      }} />
      <Menu.Item
        key="word"
        icon={<FileWordOutlined style={{ color: "#2563eb", fontSize: "15px" }} />}
        style={{
          borderRadius: "10px",
          margin: "2px 0",
          fontSize: "14px",
          height: "36px",
          lineHeight: "36px",
          fontWeight: "500",
          color: "#374151",
          transition: "all 0.2s ease",
        }}
      >
        Word Document
      </Menu.Item>
      <Menu.Item
        key="excel"
        icon={<FileExcelOutlined style={{ color: "#059669", fontSize: "15px" }} />}
        style={{
          borderRadius: "10px",
          margin: "2px 0",
          fontSize: "14px",
          height: "36px",
          lineHeight: "36px",
          fontWeight: "500",
          color: "#374151",
          transition: "all 0.2s ease",
        }}
      >
        Excel Workbook
      </Menu.Item>
      <Menu.Item
        key="pdf"
        icon={<FilePdfOutlined style={{ color: "#dc2626", fontSize: "15px" }} />}
        style={{
          borderRadius: "10px",
          margin: "2px 0",
          fontSize: "14px",
          height: "36px",
          lineHeight: "36px",
          fontWeight: "500",
          color: "#374151",
          transition: "all 0.2s ease",
        }}
      >
        PDF Document
      </Menu.Item>
      <Menu.Item
        key="powerpoint"
        icon={<FilePptOutlined style={{ color: "#dc2626", fontSize: "15px" }} />}
        style={{
          borderRadius: "10px",
          margin: "2px 0",
          fontSize: "14px",
          height: "36px",
          lineHeight: "36px",
          fontWeight: "500",
          color: "#374151",
          transition: "all 0.2s ease",
        }}
      >
        PowerPoint
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div 
        className="professional-glass-header"
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "16px",
          padding: "18px 22px",
          marginBottom: "18px",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle gradient overlay */}
        <div 
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(79, 70, 229, 0.02) 0%, rgba(124, 58, 237, 0.02) 100%)",
            pointerEvents: "none",
          }}
        />
        
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 
              style={{ 
                color: "#1f2937",
                margin: 0,
                fontSize: "18px",
                fontWeight: "600",
                letterSpacing: "-0.01em",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              }}
            >
              {title}
            </h1>
            
            {showUploadButton && (
              <div className="flex items-center gap-2">
                <Dropdown overlay={uploadMenu} trigger={["click"]} placement="bottomLeft">
                  <Button
                    type="primary"
                    icon={<CloudUploadOutlined style={{ fontSize: "15px" }} />}
                    style={{
                      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "14px",
                      height: "36px",
                      padding: "0 16px",
                      fontWeight: "500",
                      boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3), 0 2px 6px rgba(79, 70, 229, 0.2)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(79, 70, 229, 0.4), 0 4px 12px rgba(79, 70, 229, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(79, 70, 229, 0.3), 0 2px 6px rgba(79, 70, 229, 0.2)";
                    }}
                  >
                    Upload
                  </Button>
                </Dropdown>
                
                <Button
                  icon={<FolderAddOutlined style={{ fontSize: "15px" }} />}
                  style={{
                    background: "rgba(255, 255, 255, 0.4)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    borderRadius: "10px",
                    color: "#7c3aed",
                    fontSize: "14px",
                    height: "36px",
                    padding: "0 16px",
                    fontWeight: "500",
                    boxShadow: "0 2px 8px rgba(124, 58, 237, 0.15)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.5)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(124, 58, 237, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.4)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(124, 58, 237, 0.15)";
                  }}
                  onClick={() =>
                    dispatch(
                      setCommonModal({
                        title: "New Folder",
                        content: <CreateFolder parentId={parentId} />,
                        show: true,
                        width: 420,
                      })
                    )
                  }
                >
                  New Folder
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Input
              size="middle"
              style={{
                width: "240px",
                background: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "10px",
                fontSize: "14px",
                height: "36px",
                color: "#374151",
                fontWeight: "400",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s ease",
              }}
              prefix={
                <SearchOutlined 
                  style={{ 
                    color: "#6b7280", 
                    fontSize: "15px",
                    marginRight: "4px"
                  }} 
                />
              }
              placeholder="Search files and folders..."
              onChange={onChange}
            />
            
            <Select
              size="middle"
              style={{ 
                minWidth: 150,
                fontSize: "14px",
              }}
              onChange={onTypesChange}
              placeholder="File Type"
              allowClear
              dropdownStyle={{
                background: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "12px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
              }}
              options={[
                {
                  label: (
                    <span style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", color: "#374151" }}>
                      <FileWordOutlined style={{ color: "#2563eb", fontSize: "15px" }} /> Word
                    </span>
                  ),
                  value: "docx",
                },
                {
                  label: (
                    <span style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", color: "#374151" }}>
                      <FileExcelOutlined style={{ color: "#059669", fontSize: "15px" }} /> Excel
                    </span>
                  ),
                  value: "xlsx",
                },
                {
                  label: (
                    <span style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", color: "#374151" }}>
                      <FilePptOutlined style={{ color: "#dc2626", fontSize: "15px" }} /> PowerPoint
                    </span>
                  ),
                  value: "pptx",
                },
                {
                  label: (
                    <span style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", color: "#374151" }}>
                      <FilePdfOutlined style={{ color: "#dc2626", fontSize: "15px" }} /> PDF
                    </span>
                  ),
                  value: "pdf",
                },
              ]}
            />
            
            <DatePicker.RangePicker
              presets={rangePreset}
              size="middle"
              style={{
                borderRadius: "10px",
                fontSize: "14px",
                height: "36px",
              }}
              onChange={onDateRangeChange}
            />
          </div>
        </div>
      </div>

      <style>{`
        .professional-glass-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
          pointer-events: none;
        }
        
        .ant-select-selector {
          background: rgba(255, 255, 255, 0.4) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          border-radius: 10px !important;
          height: 36px !important;
          font-size: 14px !important;
          color: #374151 !important;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.2s ease !important;
        }
        
        .ant-select-selector:hover {
          border-color: rgba(79, 70, 229, 0.4) !important;
          box-shadow: 0 2px 8px rgba(79, 70, 229, 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        }
        
        .ant-select-focused .ant-select-selector {
          border-color: rgba(79, 70, 229, 0.5) !important;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1), 0 2px 8px rgba(79, 70, 229, 0.2) !important;
        }
        
        .ant-picker {
          background: rgba(255, 255, 255, 0.4) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          border-radius: 10px !important;
          height: 36px !important;
          font-size: 14px !important;
          color: #374151 !important;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.2s ease !important;
        }
        
        .ant-picker:hover {
          border-color: rgba(79, 70, 229, 0.4) !important;
          box-shadow: 0 2px 8px rgba(79, 70, 229, 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        }
        
        .ant-picker-focused {
          border-color: rgba(79, 70, 229, 0.5) !important;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1), 0 2px 8px rgba(79, 70, 229, 0.2) !important;
        }
        
        .ant-input {
          color: #374151 !important;
          font-weight: 400 !important;
        }
        
        .ant-input:hover {
          border-color: rgba(79, 70, 229, 0.4) !important;
          box-shadow: 0 2px 8px rgba(79, 70, 229, 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        }
        
        .ant-input:focus {
          border-color: rgba(79, 70, 229, 0.5) !important;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1), 0 2px 8px rgba(79, 70, 229, 0.2) !important;
        }
        
        .ant-input::placeholder {
          color: #9ca3af !important;
          font-weight: 400 !important;
        }
        
        .ant-select-selection-placeholder {
          color: #9ca3af !important;
          font-size: 14px !important;
          font-weight: 400 !important;
        }
        
        .ant-picker-input > input {
          color: #374151 !important;
        }
        
        .ant-picker-input > input::placeholder {
          color: #9ca3af !important;
          font-size: 14px !important;
          font-weight: 400 !important;
        }

        .ant-menu-item {
          color: #374151 !important;
        }
        
        .ant-menu-item:hover {
          background: rgba(79, 70, 229, 0.08) !important;
          color: #4f46e5 !important;
        }
        
        .ant-menu-item-selected {
          background: rgba(79, 70, 229, 0.12) !important;
          color: #4f46e5 !important;
        }

        .ant-dropdown {
          backdrop-filter: blur(20px) !important;
        }
        
        .ant-select-item-option {
          color: #374151 !important;
        }
        
        .ant-select-item-option:hover {
          background: rgba(79, 70, 229, 0.08) !important;
          color: #4f46e5 !important;
        }
        
        .ant-select-item-option-selected {
          background: rgba(79, 70, 229, 0.12) !important;
          color: #4f46e5 !important;
        }
        
        .ant-picker-dropdown {
          backdrop-filter: blur(20px) !important;
        }
        
        .ant-picker-panel {
          background: rgba(255, 255, 255, 0.4) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          border-radius: 12px !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
        }
        
        .ant-picker-cell:hover .ant-picker-cell-inner {
          background: rgba(79, 70, 229, 0.08) !important;
        }
        
        .ant-picker-cell-selected .ant-picker-cell-inner {
          background: #4f46e5 !important;
        }
      `}</style>
    </>
  );
};

export default CommonHeader;