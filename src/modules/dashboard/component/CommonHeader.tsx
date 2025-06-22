// import {
//   CheckCircleOutlined,
//   CloseOutlined,
//   CloudUploadOutlined,
//   FileExcelOutlined,
//   FileOutlined,
//   FilePptOutlined,
//   FileWordOutlined,
//   FolderAddOutlined,
//   FolderOpenOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";
// import { Button, Dropdown, Input, Menu, Modal, Progress } from "antd";
// import { setCommonModal } from "../../../app/slice/modalSlice";
// import CreateFolder from "./CreateFolder";
// import { useDispatch } from "react-redux";
// import { useState } from "react";
// import { useUploadFilesMutation } from "../api/dashboardEndPoints";

// interface Props {
//   title: string;
//   parentId?: number | null;
// }

// const CommonHeader = ({ title, parentId }: Props) => {
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [upload] = useUploadFilesMutation();

//   const [uploadingFiles, setUploadingFiles] = useState<
//     Array<{
//       id: string;
//       name: string;
//       size: string;
//       progress: number;
//       status: "uploading" | "completed" | "error";
//     }>
//   >([]);

//   const dispatch = useDispatch();
//   const handleMenuClick = (key: string) => {
//     switch (key) {
//       case "folder":
//         dispatch(
//           setCommonModal({
//             title: "New Folder",
//             content: <CreateFolder parentId={parentId} />,
//             show: true,
//             width: 420,
//           })
//         );
//         break;
//       case "files":
//         handleFileUpload("*/*", true);
//         break;
//       case "folder-upload":
//         handleFolderUpload();
//         break;
//       case "word":
//         handleFileUpload(
//           ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//         );
//         break;
//       case "excel":
//         handleFileUpload(
//           ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         );
//         break;
//       case "powerpoint":
//         handleFileUpload(
//           ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
//         );
//         break;
//       case "onenote":
//         handleFileUpload(".one,.onetoc2");
//         break;

//       default:
//         break;
//     }
//   };

//   const formatFileSize = (bytes: number): string => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   const simulateUpload = (file: File) => {
//     const fileId =
//       Date.now().toString() + Math.random().toString(36).substr(2, 9);
//     const uploadFile = {
//       id: fileId,
//       name: file.name,
//       size: formatFileSize(file.size),
//       progress: 0,
//       status: "uploading" as const,
//     };

//     setUploadingFiles((prev) => [...prev, uploadFile]);
//     setShowUploadModal(true);

//     // Simulate upload progress
//     const interval = setInterval(() => {
//       setUploadingFiles((prev) =>
//         prev.map((f) => {
//           if (f.id === fileId && f.status === "uploading") {
//             const newProgress = Math.min(
//               f.progress + Math.random() * 15 + 5,
//               100
//             );
//             const newStatus = newProgress >= 100 ? "completed" : "uploading";
//             return {
//               ...f,
//               progress: Math.round(newProgress),
//               status: newStatus,
//             };
//           }
//           return f;
//         })
//       );
//     }, 200);

//     // Stop simulation when complete
//     setTimeout(() => {
//       clearInterval(interval);
//       setUploadingFiles((prev) =>
//         prev.map((f) =>
//           f.id === fileId ? { ...f, progress: 100, status: "completed" } : f
//         )
//       );
//     }, 3000 + Math.random() * 2000);
//   };

//   const handleFileUpload = (accept: string, multiple: boolean = false) => {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = accept;
//     input.multiple = multiple;

//     input.onchange = (e) => {
//       const files = (e.target as HTMLInputElement).files;

//       if (files && files.length > 0) {
//         const formData = new FormData();
//         if (parentId) {
//           formData.append("folder_id", parentId.toString());
//         }
//         // Append each file individually
//         Array.from(files).forEach((file) => {
//           formData.append("files", file); // Use "files[]" if backend expects array
//           simulateUpload(file); // Optional UI simulation
//         });

//         upload(formData).then((res) => {
//           console.log(res);
//         });
//       }
//     };

//     input.click();
//   };

//   const handleFolderUpload = () => {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.webkitdirectory = true;
//     input.onchange = (e) => {
//       const files = (e.target as HTMLInputElement).files;
//       if (files) {
//         Array.from(files).forEach((file) => {
//           simulateUpload(file);
//         });
//       }
//     };
//     input.click();
//   };

//   const removeUploadFile = (id: string) => {
//     setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
//   };

//   const clearAllUploads = () => {
//     setUploadingFiles([]);
//     setShowUploadModal(false);
//   };
//   const uploadMenu = (handleMenuClick: (key: string) => void) => (
//     <Menu className="w-56" onClick={({ key }) => handleMenuClick(key)}>
//       {[
//         {
//           key: "folder",
//           icon: <FolderAddOutlined className="text-blue-500" />,
//           text: "Folder",
//         },
//         { key: "divider1", isDivider: true },
//         {
//           key: "files",
//           icon: <CloudUploadOutlined className="text-gray-500" />,
//           text: "Files upload",
//         },
//         {
//           key: "folder-upload",
//           icon: <FolderOpenOutlined className="text-gray-500" />,
//           text: "Folder upload",
//         },
//         { key: "divider2", isDivider: true },
//         {
//           key: "word",
//           icon: <FileWordOutlined className="text-blue-600" />,
//           text: "Word document",
//         },
//         {
//           key: "excel",
//           icon: <FileExcelOutlined className="text-green-600" />,
//           text: "Excel workbook",
//         },
//         {
//           key: "powerpoint",
//           icon: <FilePptOutlined className="text-red-600" />,
//           text: "PowerPoint presentation",
//         },
//         {
//           key: "onenote",
//           icon: <FileOutlined className="text-purple-600" />,
//           text: "OneNote notebook",
//         },
//       ].map((item) =>
//         item.isDivider ? (
//           <Menu.Divider key={item.key} />
//         ) : (
//           <Menu.Item key={item.key} icon={item.icon} className="py-2">
//             <span className="text-sm">{item.text}</span>
//           </Menu.Item>
//         )
//       )}
//     </Menu>
//   );
//   return (
//     <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
//       <div className="flex items-center gap-4">
//         <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
//         <div className="flex items-center gap-2">
//           <Dropdown
//             overlay={uploadMenu(handleMenuClick)}
//             trigger={["click"]}
//             placement="bottomLeft"
//           >
//             <Button
//               type="primary"
//               icon={<CloudUploadOutlined />}
//               className="bg-blue-600 hover:bg-blue-700 border-blue-600 rounded-sm h-8"
//             >
//               Upload
//             </Button>
//           </Dropdown>
//           <Button
//             icon={<FolderAddOutlined />}
//             className="h-8 rounded-sm border-gray-300"
//             onClick={() =>
//               dispatch(
//                 setCommonModal({
//                   title: "New Folder",
//                   content: <CreateFolder parentId={parentId} />,
//                   show: true,
//                   width: 420,
//                 })
//               )
//             }
//           >
//             New folder
//           </Button>
//         </div>
//       </div>
//       <Input
//         className="w-64 rounded-sm border-gray-300"
//         prefix={<SearchOutlined className="text-gray-400" />}
//         placeholder="Search "
//         //   value={searchTerm}
//         //   onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       <Modal
//         title={
//           <div className="flex items-center justify-between">
//             <span className="text-lg font-medium">Uploading files</span>
//             <Button
//               type="text"
//               icon={<CloseOutlined />}
//               onClick={clearAllUploads}
//               className="text-gray-400 hover:text-gray-600"
//             />
//           </div>
//         }
//         open={showUploadModal}
//         footer={null}
//         closable={false}
//         width={480}
//         className="upload-modal"
//       >
//         <div className="max-h-96 overflow-y-auto">
//           {uploadingFiles.map((file) => (
//             <div
//               key={file.id}
//               className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0"
//             >
//               <div className="flex-shrink-0">
//                 {file.status === "completed" ? (
//                   <CheckCircleOutlined className="text-green-500 text-lg" />
//                 ) : file.status === "error" ? (
//                   <CloseOutlined className="text-red-500 text-lg" />
//                 ) : (
//                   <CloudUploadOutlined className="text-blue-500 text-lg" />
//                 )}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-sm font-medium text-gray-900 truncate">
//                     {file.name}
//                   </span>
//                   <span className="text-xs text-gray-500 ml-2">
//                     {file.size}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Progress
//                     percent={file.progress}
//                     size="small"
//                     status={
//                       file.status === "error"
//                         ? "exception"
//                         : file.status === "completed"
//                         ? "success"
//                         : "active"
//                     }
//                     showInfo={false}
//                     className="flex-1"
//                   />
//                   <span className="text-xs text-gray-500 min-w-[2.5rem] text-right">
//                     {file.status === "completed"
//                       ? "Done"
//                       : file.status === "error"
//                       ? "Error"
//                       : `${file.progress}%`}
//                   </span>
//                 </div>
//               </div>
//               <Button
//                 type="text"
//                 icon={<CloseOutlined />}
//                 size="small"
//                 onClick={() => removeUploadFile(file.id)}
//                 className="text-gray-400 hover:text-gray-600 flex-shrink-0"
//               />
//             </div>
//           ))}
//         </div>

//         {uploadingFiles.length > 0 && (
//           <div className="mt-4 pt-3 border-t border-gray-200">
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-gray-600">
//                 {uploadingFiles.filter((f) => f.status === "completed").length}{" "}
//                 of {uploadingFiles.length} files uploaded
//               </span>
//               <Button
//                 type="link"
//                 onClick={clearAllUploads}
//                 className="text-blue-600 p-0 h-auto"
//               ></Button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default CommonHeader;

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
import { Button, Dropdown, Input, Menu, Progress, notification } from "antd";
import { setCommonModal } from "../../../app/slice/modalSlice";
import CreateFolder from "./CreateFolder";
import { useDispatch } from "react-redux";
import { useUploadFilesMutation } from "../api/dashboardEndPoints";
import { useEffect, useState } from "react";

interface Props {
  title: string;
  parentId?: number | null;
}

const CommonHeader = ({ title, parentId }: Props) => {
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
      </div>
      <Input
        className="w-64 rounded-sm border-gray-300"
        prefix={<SearchOutlined className="text-gray-400" />}
        placeholder="Search"
      />
    </div>
  );
};

export default CommonHeader;
