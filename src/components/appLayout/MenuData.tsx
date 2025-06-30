import { Link } from "react-router-dom";
import { IMenuData } from "../../../Types/MenuData";
import { FaFolderClosed } from "react-icons/fa6";
import { ImBin2 } from "react-icons/im";
import { SiSharex } from "react-icons/si"
import { FaHome } from "react-icons/fa";
export const sideBarItems = (employee_id: string, roleId: number) => {
  let menuData: IMenuData[] = [
    {
      label: <Link to="/">Home</Link>,
      key: "/",
      icon: <FaHome size={20} />,
    },
    {
      label: <Link to="/shared">Shared Files</Link>,
      key: "/shared",
      icon: <SiSharex size={20} />,
    },
    {
      label: <Link to="/my-file">My Files</Link>,
      key: "/my-file",
      icon: <FaFolderClosed size={20} />,
    },
    {
      label: <Link to="/recycle-bin">Recycle Bin</Link>,
      key: "/recycle-bin",
      icon: <ImBin2 size={20} />,
    },
    
  ];
  return menuData;
};
