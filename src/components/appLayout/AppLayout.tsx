/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LogoutOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Grid,
  Image,
  Layout,
  Menu,
  Popover,
  theme,
  Input,
  Avatar,
  Typography,
  Space,
} from "antd";
import type { MenuInfo } from "rc-menu/lib/interface";
import { useEffect, useState, useCallback } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { setLogout } from "../../app/features/userSlice";
import { RootState, useAppDispatch } from "../../app/store/store";
import { menuItems } from "./AppLayoutData";
import { useSelector } from "react-redux";
import { api, useLogoutMutation } from "../../app/api/api";
import { useGetMeQuery } from "../../app/api/userApi";
import logo from "../../assets/logo.png";
import { setCommonModal } from "../../app/slice/modalSlice";
import ChangeEmployeePassword from "../navBar/ChangePassword";
import { RiLockPasswordLine } from "react-icons/ri";

const { useBreakpoint } = Grid;
const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

export const AppLayout: React.FC = () => {
  const { data: profile } = useGetMeQuery();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [currentSelection, setCurrentSelection] = useState("");

  const location = useLocation();
  const screens = useBreakpoint();
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  const dispatch = useAppDispatch();
  const [logOut, { isSuccess }] = useLogoutMutation();
  const navigate = useNavigate();
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const isMobile = !screens.lg;
  const isTablet = !screens.md;

  useEffect(() => {
    if (isSuccess) {
      dispatch(setLogout());
      dispatch(api.util.resetApiState());
      navigate("/login");
    }
  }, [isSuccess, dispatch, navigate]);

  useEffect(() => {
    setCollapsed(isMobile);
    const segments = location.pathname.split("/").filter(Boolean);
    setCurrentSelection(
      segments.length >= 2
        ? `/${segments[0]}/${segments[1]}`
        : location.pathname
    );
    setOpenKeys(segments[0] ? [segments[0]] : []);
  }, [isMobile, location.pathname]);

  const menuData = menuItems(profile?.data, roleId as number);
  const rootKeys = menuData
    .filter((item) => item?.key)
    .map((item) => item!.key);

  const onOpenChange = useCallback(
    (keys: string[]) => {
      const newKey = keys.find((key) => !openKeys.includes(key));
      setOpenKeys(!newKey || !rootKeys.includes(newKey) ? keys : [newKey]);
    },
    [openKeys, rootKeys]
  );

  const handleMenuClick = useCallback(
    (e: MenuInfo) => {
      setCurrentSelection(e.key);
      if (isMobile) setCollapsed(true);
    },
    [isMobile]
  );

  const handleResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX,
        startWidth = sidebarWidth;
      const onMove = (e: MouseEvent) =>
        setSidebarWidth(
          Math.max(200, Math.min(400, startWidth + e.clientX - startX))
        );
      const onEnd = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onEnd);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onEnd);
    },
    [sidebarWidth]
  );

  const userMenu = (
    <div style={{ minWidth: 200, padding: "8px 0" }}>
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #f0f0f0",
          marginBottom: 8,
        }}
      >
        <Space direction="vertical" size={4}>
          <Text strong>{profile?.data?.name || "User"}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {profile?.data?.email}
          </Text>
        </Space>
      </div>

      <Button
        onClick={() => {
          dispatch(
            setCommonModal({
              title: "Change Employee Password",
              content: <ChangeEmployeePassword />,
              show: true,
              width: 550,
            })
          );
        }}
        type="text"
        icon={<RiLockPasswordLine />}
        block
        style={{ textAlign: "left", justifyContent: "flex-start" }}
      >
        Change Password
      </Button>

      <Button
        type="text"
        danger
        icon={<LogoutOutlined />}
        onClick={() => logOut()}
        block
        style={{
          textAlign: "left",
          justifyContent: "flex-start",
          marginTop: 4,
        }}
      >
        Sign Out
      </Button>
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isMobile && !collapsed && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 999,
          }}
          onClick={() => setCollapsed(true)}
        />
      )}

      <Sider
        width={sidebarWidth}
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          position: isMobile ? "fixed" : "sticky",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: isMobile ? 1000 : 100,
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
          boxShadow: isMobile ? "2px 0 8px rgba(0,0,0,0.15)" : "none",
          transform:
            isMobile && collapsed ? "translateX(-100%)" : "translateX(0)",
          transition: "all 0.2s ease-out",
        }}
      >
        <div
          style={{
            padding: collapsed ? "20px 8px" : "24px 16px",
            textAlign: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          {collapsed ? (
            <Avatar
              size={40}
              src={logo}
              style={{ cursor: "pointer" }}
              onClick={() => setCollapsed(false)}
            />
          ) : (
            <Image
              height={isTablet ? 100 : 140}
              preview={false}
              src={logo}
              style={{ borderRadius: 8, cursor: "pointer" }}
              onClick={() => setCollapsed(true)}
            />
          )}
        </div>
        <div style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}>
          <Menu
            mode="inline"
            items={menuData}
            selectedKeys={[currentSelection]}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onClick={handleMenuClick}
            inlineIndent={16}
            style={{ border: "none", background: "transparent", fontSize: 14 }}
          />
        </div>
        {!isMobile && !collapsed && (
          <div
            onMouseDown={handleResize}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 4,
              height: "100%",
              cursor: "col-resize",
              background: "transparent",
              zIndex: 10,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = colorPrimary)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          />
        )}
      </Sider>

      <Layout style={{ marginLeft: isMobile ? 0 : undefined }}>
        <Header
          style={{
            padding: isTablet ? "0 16px" : "0 24px",
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            height: 64,
            position: "sticky",
            top: 0,
            zIndex: 98,
            boxShadow: "0 1px 4px rgba(0,21,41,0.08)",
          }}
        >
          <div style={{ flex: 1 }} />
          <div style={{ flex: 2, display: "flex", justifyContent: "center" }}>
            {!isTablet && (
              <Input
                placeholder="Search anything..."
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                style={{
                  width: screens.xl ? 400 : 300,
                  borderRadius: 25,
                  background: "#fafafa",
                  border: "1px solid #e0e0e0",
                  paddingLeft: 16,
                  paddingRight: 16,
                }}
                allowClear
              />
            )}
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <Space size="middle">
              {isTablet && (
                <Button type="text" icon={<SearchOutlined />} size="large" />
              )}
              <Popover
                content={userMenu}
                trigger="click"
                placement="bottomRight"
              >
                <Button
                  type="text"
                  style={{
                    padding: "4px 8px",
                    height: "auto",
                    border: "1px solid #d9d9d9",
                    borderRadius: 6,
                  }}
                >
                  <Space>
                    <Avatar
                      size={32}
                      icon={<UserOutlined />}
                      style={{ backgroundColor: colorPrimary }}
                    />
                    {!isTablet && (
                      <Text style={{ fontSize: 14 }}>
                        {profile?.data?.name?.split(" ")[0] || "User"}
                      </Text>
                    )}
                  </Space>
                </Button>
              </Popover>
            </Space>
          </div>
        </Header>

        <Content
          style={{ background: "#f5f5f5", minHeight: "calc(100vh - 128px)" }}
        >
          <div
            style={{
              padding: isTablet ? 16 : 24,
              background: "#fff",
              margin: isTablet ? 8 : 16,
              borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              minHeight: "calc(100vh - 200px)",
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer
          style={{
            textAlign: "center",
            padding: isTablet ? "8px 16px" : "12px 24px",
            fontSize: 12,
            color: "#8c8c8c",
            background: "#fff",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Text type="secondary">
            © {new Date().getFullYear()} DBL Group. All rights reserved.
          </Text>
        </Footer>
      </Layout>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .ant-menu-item:hover, .ant-menu-submenu-title:hover { background-color: #f0f5ff !important; }
        .ant-menu-item-selected { background-color: #e6f4ff !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d9d9d9; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #bfbfbf; }
        @media (max-width: 768px) {
          .ant-layout-header { padding: 0 12px !important; }
          .ant-layout-content > div { margin: 4px !important; padding: 12px !important; }
        }
      `,
        }}
      />
    </Layout>
  );
};
