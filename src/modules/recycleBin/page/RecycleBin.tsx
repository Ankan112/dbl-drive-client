// import {
//   Card,
//   Input,
//   Tag,
//   Typography,
//   Button,
//   Checkbox,
//   Tooltip,
//   Space,
// } from "antd";
// import {
//   useGetRecycleBinListQuery,
//   usePermanentDeleteFileMutation,
//   useRestoreFileMutation,
// } from "../api/recycleBinEndpoint";
// import {
//   SearchOutlined,
//   DeleteOutlined,
//   RollbackOutlined,
// } from "@ant-design/icons";
// import { IRecycleBinList } from "../types/RecycleBinTypes";
// import { useState, useEffect } from "react";

// const RecycleBin = () => {
//   const { data } = useGetRecycleBinListQuery();
//   const [deletePermanently] = usePermanentDeleteFileMutation();
//   const [restoredFile] = useRestoreFileMutation();

//   const [selectedItems, setSelectedItems] = useState<{
//     fileIds: number[];
//     folderIds: number[];
//   }>({
//     fileIds: [],
//     folderIds: [],
//   });

//   const [selectAll, setSelectAll] = useState(false);

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

//   const handlePermanentDelete = () => {
//     deletePermanently(selectedItems);
//   };

//   const handleRestore = () => {
//     restoredFile(selectedItems);
//   };

//   const handleSelectAll = (checked: boolean) => {
//     setSelectAll(checked);
//     if (checked && data?.data?.length) {
//       const fileIds = data.data
//         .filter((item) => item.type === "file")
//         .map((item) => item.id);
//       const folderIds = data.data
//         .filter((item) => item.type === "folder")
//         .map((item) => item.id);

//       setSelectedItems({
//         fileIds,
//         folderIds,
//       });
//     } else {
//       setSelectedItems({ fileIds: [], folderIds: [] });
//     }
//   };

//   useEffect(() => {
//     const totalItems = data?.data?.length || 0;
//     const selectedCount =
//       selectedItems.fileIds.length + selectedItems.folderIds.length;
//     setSelectAll(selectedCount > 0 && selectedCount === totalItems);
//   }, [selectedItems, data]);

//   return (
//     <div className="h-screen bg-gray-50 flex flex-col">
//       {/* Header */}
//       <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
//         <Typography.Title level={4} className="!mb-0">
//           Recycle Bin
//         </Typography.Title>
//         <Input
//           className="w-64 rounded-sm border-gray-300"
//           prefix={<SearchOutlined className="text-gray-400" />}
//           placeholder="Search File"
//         />
//       </div>

//       {/* Actions */}
//       <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
//         <Checkbox
//           checked={selectAll}
//           onChange={(e) => handleSelectAll(e.target.checked)}
//         >
//           Select All
//         </Checkbox>
//         <div className="flex gap-3">
//           <Tooltip title="Restore selected items">
//             <Button
//               icon={<RollbackOutlined />}
//               type="default"
//               onClick={handleRestore}
//               disabled={
//                 selectedItems.fileIds.length === 0 &&
//                 selectedItems.folderIds.length === 0
//               }
//             >
//               Restore
//             </Button>
//           </Tooltip>
//           <Tooltip title="Permanently delete selected items">
//             <Button
//               icon={<DeleteOutlined />}
//               type="primary"
//               danger
//               onClick={handlePermanentDelete}
//               disabled={
//                 selectedItems.fileIds.length === 0 &&
//                 selectedItems.folderIds.length === 0
//               }
//             >
//               Delete Permanently
//             </Button>
//           </Tooltip>
//         </div>
//       </div>

//       {/* Cards Grid */}
//       <div className="p-6">
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
//           {data?.data?.map((item: IRecycleBinList) => {
//             const isChecked =
//               item.type === "file"
//                 ? selectedItems.fileIds.includes(item.id)
//                 : selectedItems.folderIds.includes(item.id);

//             return (
//               <Card
//                 key={item.id}
//                 hoverable
//                 className="relative shadow-md rounded-lg text-center p-2"
//                 bodyStyle={{ padding: "12px" }}
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

// export default RecycleBin;

import { Input, Typography, Button, Checkbox, Tooltip, Empty } from "antd";
import {
  useGetRecycleBinListQuery,
  usePermanentDeleteFileMutation,
  useRestoreFileMutation,
} from "../api/recycleBinEndpoint";
import {
  SearchOutlined,
  DeleteOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { IRecycleBinList } from "../types/RecycleBinTypes";
import { useState, useEffect } from "react";
import FolderFileCard from "../../dashboard/component/FolderFileCard";
import { IPaginationParams } from "../../myFile/types/myFileTypes";
import CommonHeader from "../../dashboard/component/CommonHeader";
// Import the FileCard component

const RecycleBin = () => {
  const [deletePermanently] = usePermanentDeleteFileMutation();
  const [restoredFile] = useRestoreFileMutation();

  const [selectedItems, setSelectedItems] = useState<{
    fileIds: number[];
    folderIds: number[];
  }>({
    fileIds: [],
    folderIds: [],
  });

  const [selectAll, setSelectAll] = useState(false);
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
  const { data } = useGetRecycleBinListQuery({ ...filter });

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

  const handlePermanentDelete = () => {
    deletePermanently(selectedItems);
  };

  const handleRestore = () => {
    restoredFile(selectedItems);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked && data?.data?.length) {
      const fileIds = data?.data
        .filter((item) => item.type === "file")
        .map((item) => item.id);
      const folderIds = data?.data
        .filter((item) => item.type === "folder")
        .map((item) => item.id);

      setSelectedItems({
        fileIds,
        folderIds,
      });
    } else {
      setSelectedItems({ fileIds: [], folderIds: [] });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <CommonHeader
        title="Recycle Bin"
        onChange={(e) =>
          setFilter({ ...filter, key: e.target.value, offset: 0 })
        }
      />
      {/* Actions Bar */}
      <div className="flex items-center justify-between px-6 py-4 ">
        <div className="flex items-center space-x-4">
          <Checkbox
            checked={selectAll}
            onChange={(e) => handleSelectAll(e.target.checked)}
            disabled={!data?.data?.length}
          >
            Select All
          </Checkbox>
        </div>

        <div className="flex gap-3">
          <Tooltip title="Restore selected items">
            <Button
              icon={<RollbackOutlined />}
              type="default"
              onClick={handleRestore}
              disabled={
                selectedItems.fileIds.length === 0 &&
                selectedItems.folderIds.length === 0
              }
              className="rounded-lg"
            >
              Restore
            </Button>
          </Tooltip>
          <Tooltip title="Permanently delete selected items">
            <Button
              icon={<DeleteOutlined />}
              type="primary"
              danger
              onClick={handlePermanentDelete}
              disabled={
                selectedItems.fileIds.length === 0 &&
                selectedItems.folderIds.length === 0
              }
              className="rounded-lg"
            >
              Delete Permanently
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Content Area */}
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {data?.data?.map((item: IRecycleBinList) => {
            const isSelected =
              item.type === "file"
                ? selectedItems.fileIds.includes(item.id)
                : selectedItems.folderIds.includes(item.id);

            return (
              <FolderFileCard
                key={item.id}
                id={item.id}
                name={item.name}
                type={item.type}
                createdBy={item.created_by_name}
                createdAt={item.created_at}
                isSelected={isSelected}
                showCheckbox={true}
                onCheckboxChange={handleCheckboxChange}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecycleBin;
