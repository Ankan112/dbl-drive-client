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
    <Menu onClick={({ key }) => handleMenuClick(key)}>
      <Menu.Item
        key="files"
        icon={<CloudUploadOutlined style={{ color: "#1890ff" }} />}
      >
        Upload Files
      </Menu.Item>
      {/* <Menu.Item key="folder-upload" icon={<FolderOpenOutlined style={{ color: "#4CAF50" }} />}>
        Upload Folder
      </Menu.Item> */}
      <Menu.Divider />
      <Menu.Item
        key="word"
        icon={<FileWordOutlined style={{ color: "#1E90FF" }} />}
      >
        Word Document
      </Menu.Item>
      <Menu.Item
        key="excel"
        icon={<FileExcelOutlined style={{ color: "#4CAF50" }} />}
      >
        Excel Workbook
      </Menu.Item>
      <Menu.Item
        key="powerpoint"
        icon={<FilePptOutlined style={{ color: "#FF5722" }} />}
      >
        PowerPoint
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          {showUploadButton && (
            <>
              <Dropdown overlay={uploadMenu} trigger={["click"]}>
                <Button
                  type="primary"
                  icon={<CloudUploadOutlined />}
                  className="rounded-full bg-blue-600 hover:bg-blue-700 border-none text-white px-5 h-10 shadow-md transition duration-300"
                >
                  Upload
                </Button>
              </Dropdown>
              <Button
                icon={<FolderAddOutlined />}
                className="rounded-full bg-blue-600 hover:bg-blue-700 border-none text-white px-5 h-10 shadow-md transition duration-300"
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
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Input
            className="w-full md:w-64 rounded-full border-gray-300"
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search"
            onChange={onChange}
          />
          <Select
            className="rounded-full"
            style={{ minWidth: 160 }}
            onChange={onTypesChange}
            placeholder="File Type"
            allowClear
            options={[
              {
                label: (
                  <>
                    <FileWordOutlined className="text-blue-600" /> Word
                  </>
                ),
                value: "docx",
              },
              {
                label: (
                  <>
                    <FileExcelOutlined className="text-green-600" /> Excel
                  </>
                ),
                value: "xlsx",
              },
              {
                label: (
                  <>
                    <FilePptOutlined className="text-red-600" /> PowerPoint
                  </>
                ),
                value: "pptx",
              },
              {
                label: (
                  <>
                    <FilePdfOutlined className="text-gray-600" /> PDF
                  </>
                ),
                value: "pdf",
              },
            ]}
          />
          <DatePicker.RangePicker
            presets={rangePreset}
            className="rounded-full w-full md:w-auto"
            onChange={onDateRangeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CommonHeader;
