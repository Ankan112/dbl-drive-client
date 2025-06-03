import React from "react";
import { useOutletContext } from "react-router";
import { FileItem } from "../Pages/Dashboard";

const Home = () => {
  const { searchTerm, viewMode, filteredFiles, handleSelectItem } =
    useOutletContext<{
      searchTerm: string;
      viewMode: "grid" | "list";
      filteredFiles: any[];
      handleSelectItem: (id: number) => void;
    }>();
  return (
    <div className={viewMode === "grid" ? "p-6" : ""}>
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4"
            : ""
        }
      >
        {filteredFiles?.map((file: any) => (
          <FileItem
            key={file.id}
            file={file}
            viewMode={viewMode}
            //   isSelected={selectedItems.includes(file.id)}
            onSelect={() => handleSelectItem(file.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
