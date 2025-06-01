/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Grid,
  Image,
  Layout,
  Menu,
  Dropdown,
  MenuProps,
  Popover,
  theme,
  Input,
} from "antd";
import { Footer } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { setLogout } from "../../app/features/userSlice";
import { RootState, useAppDispatch } from "../../app/store/store";
import { menuItems } from "./AppLayoutData";
// import LiveTime from "../Time/LiveTime";
import { useSelector } from "react-redux";
// import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { api } from "../../app/api/api";
import { useGetMeQuery } from "../../app/api/userApi";
import logo from "../../assets/logo.png";
import { roleID } from "../../utils/helper";
// import Notification from "../notification/Notification";
const { useBreakpoint } = Grid;

const { Header, Sider, Content } = Layout;
export const AppLayout = () => {
  const { data: profile } = useGetMeQuery();
  const [collapsed, setCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<string>("");
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [openKeys, setOpenKeys] = useState<Array<string>>([]);
  const location = useLocation();
  const gridBreak = useBreakpoint();
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  const dispatch = useAppDispatch();
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <a
          href="https://www.dropbox.com/scl/fi/xezlzy76ejnszoj7zah9a/System-Overview.pdf?rlkey=j16ellbggvjv4g6hpdhz63ksb&st=5weqe9nj&raw=1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Helpdesk Overview
        </a>
      </Menu.Item>
      <Menu.Item key="2">
        <a
          href="https://www.dropbox.com/scl/fi/qohmr0km29jnbdjmbtxrl/Ticket-Raise-Process.pdf?rlkey=qnfg48axugbctmuh24o1qiwse&st=cx5r02qk&raw=1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ticketing Process
        </a>
      </Menu.Item>
      <Menu.Item key="3">
        <a
          href="https://www.dropbox.com/scl/fi/2oqld6escz4faz61e363n/Profile-Update.pdf?rlkey=qn4vrnmxq3cy8uhg3y2sh5jqo&st=l8rjrhe1&raw=1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Profile Update
        </a>
      </Menu.Item>
    </Menu>
  );

  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(setLogout());
    dispatch(api.util.resetApiState());
    navigate("/login");
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  console.log(roleID);
  useEffect(() => {
    const index = location.pathname.indexOf(
      "/",
      location.pathname.indexOf("/", location.pathname.indexOf("/") + 1) + 1
    );
    const result =
      index !== -1 ? location.pathname.substring(0, index) : location.pathname;
    setCurrentSelection(result);
    const modulePath = location.pathname.split("/")[1];
    setOpenKeys([modulePath]);
  }, [location]);

  const rootSubmenuKeys = menuItems(profile?.data).map(
    (item: any) => item?.key
  );
  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const handleClick: MenuProps["onClick"] = (e) => {
    setCurrentSelection(e.key);
  };

  interface DataObject {
    children?: DataObject[] | null;
    icon: string;
    key: string;
    label: any;
  }
  function findObjectWithKey(
    data: DataObject[],
    path: {
      pathname: string;
      state?: string;
    },
    parentIndices: string[] = []
  ): string[] | null {
    for (let i = 0; i < data.length; i++) {
      if (data[i] === null) {
        continue;
      }
      const object = data[i];
      if (object.key === path.pathname || object.key === path?.state) {
        return [...parentIndices, object.key];
      }
      if (object.children && Array.isArray(object.children)) {
        const childIndices = findObjectWithKey(object.children, path, [
          ...parentIndices,
          object.key,
        ]);
        if (childIndices) {
          return childIndices;
        }
      }
    }
    return null;
  }

  useEffect(() => {
    const indices = findObjectWithKey(
      menuItems(profile?.data) as DataObject[],
      {
        pathname: location.pathname,
        state: location.state,
      }
    );
    if (indices) {
      setOpenKeys(indices);
      setCurrentSelection(indices[indices.length - 1]);
    }
  }, [location.pathname]);

  //   for full screen
  const handleFullscreenToggle = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  const enterFullscreen = () => {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    setIsFullscreen(false);
  };
  // const themeGlobal = useSelector(globalTheme);

  // const handleDarkTheme = () => {
  //   dispatch(setTheme(theme.darkAlgorithm));
  // };
  // const handleLightTheme = () => {
  //   dispatch(setTheme(theme.defaultAlgorithm));
  // };
  const grid = useBreakpoint();
  useEffect(() => {
    if (grid.xs) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [grid.xs]);
  const content = (
    <div>
      <Link to="/setting/profile">
        <Button
          color="primary"
          style={{ width: "100%" }}
          icon={<UserOutlined />}
        >
          Profile
        </Button>
      </Link>
      <br />
      {/* <Link to="https://www.google.com/" target="_blank">
        <Button
          style={{ marginTop: "10px", width: "100%" }}
          type="primary"
          icon={<LogoutOutlined />}
        >
          Self Service
        </Button>
      </Link>
      <br /> */}
      <Link to="/login">
        <Button
          danger
          style={{ marginTop: "10px", width: "100%" }}
          type="primary"
          icon={<LogoutOutlined />}
          onClick={() => handleLogout()}
        >
          Logout
        </Button>
      </Link>
    </div>
  );
  const selfService = (
    <div>
      <Link
        to="https://www.youtube.com/playlist?list=PL1I5_y65vLeHbVZMV3EmR_hLkKms_AWTD"
        target="_blank"
      >
        <Button style={{ marginTop: "10px", width: "100%" }} type="primary">
          Video Tutorial
        </Button>
      </Link>
      <br />
      <Dropdown overlay={menu} trigger={["hover"]}>
        <Button style={{ marginTop: "10px", width: "100%" }} type="primary">
          User Guide
        </Button>
      </Dropdown>
    </div>
  );

  const handleResizeStart = (e: any) => {
    e.preventDefault();
    const startX = e.clientX;

    const handleResizeDrag = (e: any) => {
      const newWidth = sidebarWidth + (e.clientX - startX);
      setSidebarWidth(newWidth);
    };

    const handleResizeEnd = () => {
      document.removeEventListener("mousemove", handleResizeDrag);
      document.removeEventListener("mouseup", handleResizeEnd);
    };

    document.addEventListener("mousemove", handleResizeDrag);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  useEffect(() => {
    if (gridBreak.xs) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [gridBreak.xs]);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={sidebarWidth}
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        style={{
          overflow: "auto",
          height: "100vh",
          // background: colorBgContainer,
          background: "#F8F8F8",
          // width: "80%",
          position: "sticky",
          top: 0,
          left: 0,
          display: `${
            grid.xs && !collapsed ? "block" : grid.md ? "block" : "none"
          }`,
        }}
      >
        <div>
          {collapsed ? (
            <div className="flex justify-center mt-2">
              <Image
                height={40}
                preview={false}
                src={logo}
                alt="DBI Group Logo"
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <Image
                height={120}
                preview={false}
                src={logo}
                alt="DBI Group Logo"
              />
            </div>
          )}
          <div className="flex justify-center">
            <Button
              icon={<PlusOutlined />}
              type="primary"
              style={{ width: "80%", margin: "0 auto", borderRadius: "20px" }}
            >
              Create or Upload
            </Button>
          </div>
        </div>
        {/* {!collapsed && (
          <div
            style={{
              backgroundColor: "#e6e6e6",
              textAlign: "center",
            }}
          >
            <Typography.Title level={4} style={{ padding: "10px 0" }}>
              <Avatar src={userIcon} /> Hello {profile?.data?.name}
            </Typography.Title>
          </div>
        )} */}
        <div className="resize-handle" onMouseDown={handleResizeStart} />
        <Menu
          mode="inline"
          items={menuItems(profile?.data, roleId as number)}
          style={{ marginTop: "15px" }}
          selectedKeys={[currentSelection]}
          openKeys={openKeys}
          defaultSelectedKeys={["/"]}
          onOpenChange={onOpenChange}
          onClick={handleClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "linear-gradient(135deg, #F8F8F8, #F8F8F8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div style={{ width: "350px" }}>
              <Input
                placeholder="Search"
                width={"100%"}
                size="large"
                prefix={<SearchOutlined />}
                style={{ borderRadius: "20px", background: "#fff" }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              padding: "10px",
            }}
          >
            <Popover content={content}>
              <Button
                icon={<UserOutlined />}
                type="dashed"
                style={{
                  marginRight: "20px",
                }}
              />
            </Popover>
          </div>
        </Header>

        <Content
          style={{
            background: "#fff",
          }}
        >
          <Outlet />
        </Content>

        <Footer
          style={{
            textAlign: "center",
            padding: 8,
            margin: 0,
            fontSize: 13,
            color: "#343a40",
            background: "rgba(240, 242, 245, 1)",
          }}
        >
          <strong>
            Copyright © {new Date().getFullYear()} DBL Group. All Rights
            Reserved.
          </strong>
        </Footer>
      </Layout>
    </Layout>
  );
};
