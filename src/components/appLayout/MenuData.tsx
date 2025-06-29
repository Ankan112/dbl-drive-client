import { LuLayoutDashboard } from "react-icons/lu";
import { TbUserHexagon } from "react-icons/tb";
import { Link } from "react-router-dom";
import { IMenuData } from "../../../Types/MenuData";
import { AiOutlineHome } from "react-icons/ai";
import { FaRegFolderClosed } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
export const sideBarItems = (employee_id: string, roleId: number) => {
  let menuData: IMenuData[] = [
    {
      label: <Link to="/">Home</Link>,
      key: "/",
      icon: <AiOutlineHome size={20} />,
    },
    {
      label: <Link to="/">Shared Files</Link>,
      key: "/shared",
      icon: <AiOutlineHome size={20} />,
    },
    {
      label: <Link to="/my-file">My Files</Link>,
      key: "/my-file",
      icon: <FaRegFolderClosed size={20} />,
    },
    {
      label: <Link to="/recycle-bin">Recycle Bin</Link>,
      key: "/recycle-bin",
      icon: <RiDeleteBinLine size={20} />,
    },
    // {
    //   label: <Link to="/about">About</Link>,
    //   key: "/",
    //   icon: <TbUserHexagon size={20} />,
    // },
  ];
  return menuData;
};
