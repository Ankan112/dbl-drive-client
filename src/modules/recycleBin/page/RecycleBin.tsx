import { DeleteOutlined, RollbackOutlined } from "@ant-design/icons";
import { Button, Checkbox, Pagination, Tooltip } from "antd";
import { useState } from "react";
import CommonHeader from "../../dashboard/component/CommonHeader";
import FolderFileCard from "../../dashboard/component/FolderFileCard";
import { IPaginationParams } from "../../myFile/types/myFileTypes";
import {
  useGetRecycleBinListQuery,
  usePermanentDeleteFileMutation,
  useRestoreFileMutation,
} from "../api/recycleBinEndpoint";
import { IRecycleBinList } from "../types/RecycleBinTypes";

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
        onDateRangeChange={(_: any, e: any) =>
          setFilter({
            ...filter,
            start_date: e[0],
            end_date: e[1],
            offset: 0,
          })
        }
        onTypesChange={(e) => setFilter({ ...filter, type: e, offset: 0 })}
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
                showThreeDot={false}
              />
            );
          })}
        </div>
        {(data?.count || 0) > 40 ? (
          <div className="mt-4">
            <Pagination
              size="small"
              align="end"
              pageSizeOptions={["40", "50", "100", "200"]}
              current={page}
              pageSize={pageSize}
              total={data?.count || 0}
              showTotal={(total) => `Total ${total}`}
              onChange={handlePaginationChange}
              showSizeChanger
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RecycleBin;
