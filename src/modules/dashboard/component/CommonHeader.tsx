import {
  CheckCircleOutlined,
  CloseOutlined,
  CloudUploadOutlined,
  FileExcelOutlined,
  FileOutlined,
  FilePptOutlined,
  FileWordOutlined,
  FolderAddOutlined,
  FolderOpenOutlined,
  SearchOutlined,
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
import { useEffect, useState } from "react";

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

  // const formatFileSize = (bytes: number): string => {
  //   if (bytes === 0) return "0 Bytes";
  //   const k = 1024;
  //   const sizes = ["Bytes", "KB", "MB", "GB"];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  // };

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
          />
        ),
        icon: <CloudUploadOutlined style={{ color: "#1890ff" }} />,
        duration: 0,
        placement: "bottomRight",
        closable: false,
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
              description: "The file was uploaded successfully.",
              icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
              placement: "bottomRight",
            });
          })
          .catch(() => {
            notification.error({
              key,
              message: `Upload failed: ${file.name}`,
              description: "Something went wrong while uploading.",
              icon: <CloseOutlined style={{ color: "#ff4d4f" }} />,
              placement: "bottomRight",
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
        Array.from(files).forEach((file) => {
          showUploadNotification(file);
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
                />
              ),
              icon: <CloudUploadOutlined style={{ color: "#1890ff" }} />,
              duration: 0,
              placement: "bottomRight",
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
                    description: "The file was uploaded successfully.",
                    icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
                    placement: "bottomRight",
                  });
                })
                .catch(() => {
                  notification.error({
                    key,
                    message: `Upload failed: ${file.name}`,
                    description: "Something went wrong while uploading.",
                    icon: <CloseOutlined style={{ color: "#ff4d4f" }} />,
                    placement: "bottomRight",
                  });
                });
            }
          }, 200);
        });
      }
    };

    input.click();
  };

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
      default:
        break;
    }
  };

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

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {showUploadButton && (
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
            <Button
              icon={<FolderAddOutlined />}
              className="h-8 rounded-sm border-gray-300"
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
              New folder
            </Button>
          </div>
        )}
      </div>
      <Space>
        <Input
          className="w-64 rounded-sm border-gray-300"
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search"
          onChange={onChange}
        />
        <Select
          style={{ width: "180px" }}
          onChange={onTypesChange}
          placeholder="Select Types"
          allowClear
          showSearch
          options={[
            { label: "Folder", value: "folder" },
            { label: "PDF", value: "pdf" },
            { label: "Word Document", value: "docx" },
            { label: "Excel Spreadsheet", value: "xlsx" },
            { label: "PowerPoint Presentation", value: "pptx" },
            { label: "Image (JPEG)", value: "jpg" },
            { label: "Image (PNG)", value: "png" },
            { label: "Text File", value: "txt" },
            { label: "SQL File", value: "sql" },
            { label: "ZIP Archive", value: "zip" },
            { label: "CSV File", value: "csv" },
            { label: "Video (MP4)", value: "mp4" },
          ]}
        />

        <DatePicker.RangePicker
          // presets={rangePreset}
          style={{ width: "100%" }}
          onChange={onDateRangeChange}
        />
      </Space>
    </div>
  );
};

export default CommonHeader;
