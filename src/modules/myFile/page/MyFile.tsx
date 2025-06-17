// import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
// import {
//   Button,
//   Card,
//   Checkbox,
//   Input,
//   Space,
//   Tag,
//   Tooltip,
//   Typography,
// } from "antd";
// import { useGetMyFileListQuery } from "../api/myFileEndpoint";
// import { useMoveToRecycleBinMutation } from "../../recycleBin/api/recycleBinEndpoint";
// import { useState, useEffect } from "react";
// import { IMyFileList } from "../types/myFileTypes";
// import { useGetFileDetailsQuery } from "../../dashboard/api/dashboardEndPoints";

// const MyFile = () => {
//   const [fileId, setFileId] = useState<number>(0);

//   const { data } = useGetMyFileListQuery();
//   const { data: fileDetails } = useGetFileDetailsQuery(fileId, {
//     skip: !fileId,
//   });
//   console.log(fileDetails?.data?.file_path);
//   const [moveToRecycle] = useMoveToRecycleBinMutation();

//   const [selectedItems, setSelectedItems] = useState<{
//     fileIds: number[];
//     folderIds: number[];
//   }>({
//     fileIds: [],
//     folderIds: [],
//   });

//   // Select All State
//   const [selectAll, setSelectAll] = useState(false);

//   // Handle individual checkbox
//   const handleCheckboxChange = (id: number, type: string, checked: boolean) => {
//     setSelectedItems((prev) => {
//       const key = type === "file" ? "fileIds" : "folderIds";
//       const updatedIds = checked
//         ? [...prev[key], id]
//         : prev[key].filter((itemId) => itemId !== id);
//       return {
//         ...prev,
//         [key]: updatedIds,
//       };
//     });
//   };

//   // Handle select all toggle
//   const handleSelectAll = (checked: boolean) => {
//     setSelectAll(checked);
//     if (checked && data?.data?.length) {
//       const allFileIds = data.data
//         .filter((item) => item.type === "file")
//         .map((item) => item.id);
//       const allFolderIds = data.data
//         .filter((item) => item.type === "folder")
//         .map((item) => item.id);

//       setSelectedItems({
//         fileIds: allFileIds,
//         folderIds: allFolderIds,
//       });
//     } else {
//       setSelectedItems({ fileIds: [], folderIds: [] });
//     }
//   };

//   // Sync selectAll checkbox with individual selections
//   useEffect(() => {
//     const totalItems = data?.data?.length || 0;
//     const totalSelected =
//       selectedItems.fileIds.length + selectedItems.folderIds.length;

//     setSelectAll(totalSelected > 0 && totalSelected === totalItems);
//   }, [selectedItems, data]);

//   // Move to recycle bin
//   const handleRecycleBin = () => {
//     moveToRecycle(selectedItems);
//     console.log("Move to recycle bin:", selectedItems);
//   };

//   return (
//     <div className="h-screen bg-gray-50 flex flex-col">
//       {/* Header */}
//       <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
//         <Typography.Title level={4} className="!mb-0">
//           My Files
//         </Typography.Title>
//         <Input
//           className="w-64 rounded-sm border-gray-300"
//           prefix={<SearchOutlined className="text-gray-400" />}
//           placeholder="Search File"
//         />
//       </div>

//       {/* Action buttons */}
//       <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
//         <Checkbox
//           checked={selectAll}
//           onChange={(e) => handleSelectAll(e.target.checked)}
//         >
//           Select All
//         </Checkbox>

//         <Tooltip title="Move to bin">
//           <Button
//             icon={<DeleteOutlined />}
//             type="primary"
//             danger
//             onClick={handleRecycleBin}
//             disabled={
//               selectedItems.fileIds.length === 0 &&
//               selectedItems.folderIds.length === 0
//             }
//           >
//             Delete
//           </Button>
//         </Tooltip>
//       </div>

//       {/* Cards Grid */}
//       <div className="p-6">
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
//           {data?.data?.map((item: IMyFileList) => {
//             const isChecked =
//               item.type === "file"
//                 ? selectedItems.fileIds.includes(item.id)
//                 : selectedItems.folderIds.includes(item.id);

//             return (
//               <Card
//                 key={item.id}
//                 hoverable
//                 className="relative shadow-md rounded-lg text-center p-2"
//                 style={{ padding: "12px" }}
//               >
//                 <div className="absolute top-2 right-2">
//                   <Checkbox
//                     checked={isChecked}
//                     onChange={(e) =>
//                       handleCheckboxChange(item.id, item.type, e.target.checked)
//                     }
//                   />
//                 </div>

//                 <Space direction="vertical" size={4} align="center">
//                   <Tag
//                     color={item.type === "file" ? "blue" : "green"}
//                     style={{ textTransform: "capitalize" }}
//                   >
//                     {item.type}
//                   </Tag>
//                   <Typography.Text strong>{item.name}</Typography.Text>
//                 </Space>
//               </Card>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyFile;
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Drawer,
  Input,
  message,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useGetMyFileListQuery } from "../api/myFileEndpoint";
import { useMoveToRecycleBinMutation } from "../../recycleBin/api/recycleBinEndpoint";
import { useState, useEffect } from "react";
import { IMyFileList } from "../types/myFileTypes";
import {
  useGetFileDetailsQuery,
  useLazyGetFileDetailsQuery,
} from "../../dashboard/api/dashboardEndPoints";

const MyFile = () => {
  const [fileId, setFileId] = useState<number>(0);
  const [isPdfViewerOpen, setPdfViewerOpen] = useState(false);

  const { data } = useGetMyFileListQuery();
  // const { data: fileDetails } = useGetFileDetailsQuery(fileId, {
  //   skip: !fileId,
  // });
  const [fetchFileDetails] = useLazyGetFileDetailsQuery();

  const [moveToRecycle] = useMoveToRecycleBinMutation();

  const [selectedItems, setSelectedItems] = useState<{
    fileIds: number[];
    folderIds: number[];
  }>({
    fileIds: [],
    folderIds: [],
  });

  const [selectAll, setSelectAll] = useState(false);

  const handleCheckboxChange = (id: number, type: string, checked: boolean) => {
    setSelectedItems((prev) => {
      const key = type === "file" ? "fileIds" : "folderIds";
      const updatedIds = checked
        ? [...prev[key], id]
        : prev[key].filter((itemId) => itemId !== id);
      return {
        ...prev,
        [key]: updatedIds,
      };
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked && data?.data?.length) {
      const allFileIds = data.data
        .filter((item) => item.type === "file")
        .map((item) => item.id);
      const allFolderIds = data.data
        .filter((item) => item.type === "folder")
        .map((item) => item.id);

      setSelectedItems({
        fileIds: allFileIds,
        folderIds: allFolderIds,
      });
    } else {
      setSelectedItems({ fileIds: [], folderIds: [] });
    }
  };

  useEffect(() => {
    const totalItems = data?.data?.length || 0;
    const totalSelected =
      selectedItems.fileIds.length + selectedItems.folderIds.length;

    setSelectAll(totalSelected > 0 && totalSelected === totalItems);
  }, [selectedItems, data]);

  const handleRecycleBin = () => {
    moveToRecycle(selectedItems);
    console.log("Move to recycle bin:", selectedItems);
  };
  const handleCardClick = async (item: IMyFileList) => {
    if (item.type === "folder") {
      message.warning("Folder found!");
      return;
    }

    try {
      const res = await fetchFileDetails(item.id); // Fetch file details manually
      const filePath = res?.data?.data?.file_path;
      const fileName = res?.data?.data?.file_name;

      if (!filePath) {
        message.error("File path not found!");
        return;
      }

      const extension = filePath.split(".").pop()?.toLowerCase();

      if (extension === "pdf") {
        // Open in new tab
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

  // const handleCardClick = (item: IMyFileList) => {
  //   if (item.type === "folder") {
  //     message.warning("Folder found!");
  //     return;
  //   }

  //   // Fetch file details and use file_path
  //   setFileId(item.id);
  // };

  // useEffect(() => {
  //   if (fileDetails?.data?.file_path && fileId) {
  //     const filePath = fileDetails.data.file_path;
  //     const extension = filePath.split(".").pop()?.toLowerCase();
  //     console.log({ extension, filePath });
  //     const link = document.createElement("a");
  //     link.href = filePath;

  //     if (extension === "pdf") {
  //       message.warning("PDF found!");
  //       link.target = "_blank"; // Open in new tab
  //     } else {
  //       link.download = fileDetails.data.file_path || "file"; // Force download
  //     }

  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     setFileId(0); // reset
  //   }
  // }, [fileDetails]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <Typography.Title level={4} className="!mb-0">
          My Files
        </Typography.Title>
        <Input
          className="w-64 rounded-sm border-gray-300"
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search File"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <Checkbox
          checked={selectAll}
          onChange={(e) => handleSelectAll(e.target.checked)}
        >
          Select All
        </Checkbox>

        <Tooltip title="Move to bin">
          <Button
            icon={<DeleteOutlined />}
            type="primary"
            danger
            onClick={handleRecycleBin}
            disabled={
              selectedItems.fileIds.length === 0 &&
              selectedItems.folderIds.length === 0
            }
          >
            Delete
          </Button>
        </Tooltip>
      </div>

      {/* Cards */}
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {data?.data?.map((item: IMyFileList) => {
            const isChecked =
              item.type === "file"
                ? selectedItems.fileIds.includes(item.id)
                : selectedItems.folderIds.includes(item.id);

            return (
              <Card
                key={item.id}
                hoverable
                className="relative shadow-md rounded-lg text-center p-2 cursor-pointer"
                style={{ padding: "12px" }}
                onClick={() => handleCardClick(item)}
              >
                <div
                  className="absolute top-2 right-2 z-10"
                  onClick={(e) => e.stopPropagation()} // prevent card click
                >
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) =>
                      handleCheckboxChange(item.id, item.type, e.target.checked)
                    }
                  />
                </div>

                <Space direction="vertical" size={4} align="center">
                  <Tag
                    color={item.type === "file" ? "blue" : "green"}
                    style={{ textTransform: "capitalize" }}
                  >
                    {item.type}
                  </Tag>
                  <Typography.Text strong>{item.name}</Typography.Text>
                </Space>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyFile;
