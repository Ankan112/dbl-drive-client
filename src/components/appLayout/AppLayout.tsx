/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LogoutOutlined,
  SearchOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Button,
  Grid,
  Image,
  Layout,
  Menu,
  Popover,
  theme,
  Avatar,
  Typography,
  Space,
  Divider,
  Tooltip,
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
import { useGetFileAndFolderListQuery } from "../../modules/Shared/api/dashboardEndPoints";
import GlobalSearch from "../globalSearch/globalSearch";

const { useBreakpoint } = Grid;
const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

export const AppLayout: React.FC = () => {
  const { data: profile } = useGetMeQuery();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(220); // Reduced from 240
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [currentSelection, setCurrentSelection] = useState("");
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  const [filter, setFilter] = useState({ key: "" });

  const { data, isLoading } = useGetFileAndFolderListQuery({ ...filter });

  const handleSearch = (searchTerm: string) => {
    setFilter({ key: searchTerm });
  };

  const location = useLocation();
  const screens = useBreakpoint();
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  const dispatch = useAppDispatch();
  const [logOut, { isSuccess }] = useLogoutMutation();
  const navigate = useNavigate();
  const {
    token: { colorPrimary, colorBgContainer },
  } = theme.useToken();

  const isMobile = !screens.lg;
  const isTablet = !screens.md;

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && !collapsed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, collapsed]);

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
          Math.max(160, Math.min(300, startWidth + e.clientX - startX))
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
    <div style={{ minWidth: 220, padding: 0 }}>
      <div
        style={{
          padding: "14px 12px", // Reduced padding
          background: `linear-gradient(135deg, ${colorPrimary}10, ${colorPrimary}05)`,
          borderBottom: "1px solid #f0f0f0",
          marginBottom: 6,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 80,
            height: 80,
            background: `radial-gradient(circle, ${colorPrimary}15 0%, transparent 70%)`,
            borderRadius: "50%",
            animation: "float 5s ease-in-out infinite"
          }}
        />
        <Space direction="vertical" size={6} style={{ width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative" }}>
              <Avatar
                size={42}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: colorPrimary,
                  border: `2px solid ${colorPrimary}20`,
                  transition: "all 0.3s ease"
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  borderRadius: "50%",
                  animation: "pulse 2s infinite"
                }}
              />
            </div>
            <div>
              <Text strong style={{ fontSize: 15, display: "block", color: '#1a202c' }}>
                {profile?.data?.name || "User"}
              </Text>
              <Text type="secondary" style={{ fontSize: 11 }}>
                {profile?.data?.email}
              </Text>
            </div>
          </div>
        </Space>
      </div>

      <div style={{ padding: "6px 0" }}>
        <Button
          onClick={() => {
            dispatch(
              setCommonModal({
                title: "Change Employee Password",
                content: <ChangeEmployeePassword />,
                show: true,
                width: 500,
              })
            );
          }}
          type="text"
          icon={<RiLockPasswordLine />}
          block
          style={{
            textAlign: "left",
            justifyContent: "flex-start",
            padding: "10px 12px", // Reduced padding
            height: "auto",
            borderRadius: 6,
            margin: "3px 6px",
            transition: "all 0.3s ease"
          }}
          className="menu-button"
        >
          Change Password
        </Button>

        <Divider style={{ margin: "6px 0" }} />

        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          onClick={() => logOut()}
          block
          style={{
            textAlign: "left",
            justifyContent: "flex-start",
            padding: "10px 12px", // Reduced padding
            height: "auto",
            borderRadius: 6,
            margin: "3px 6px",
            transition: "all 0.3s ease"
          }}
          className="logout-button"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {isMobile && !collapsed && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
            backdropFilter: "blur(6px)",
            animation: "fadeIn 0.3s ease"
          }}
          onClick={() => setCollapsed(true)}
        />
      )}

      <Sider
        width={sidebarWidth}
        trigger={null}
        collapsible
        collapsed={collapsed}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
        style={{
          position: isMobile ? "fixed" : "sticky",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: isMobile ? 1000 : 100,
          background: `linear-gradient(180deg, ${colorBgContainer} 0%, #f9fafb 100%)`,
          borderRight: `1px solid ${colorPrimary}10`,
          boxShadow: sidebarHovered
            ? `0 15px 30px ${colorPrimary}10`
            : "0 3px 15px rgba(0,0,0,0.06)",
          transform: isMobile && collapsed ? "translateX(-100%)" : "translateX(0)",
          transition: "all 0.3s ease"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100%",
            background: `linear-gradient(135deg, ${colorPrimary}01 0%, transparent 50%)`,
            pointerEvents: "none",
            opacity: sidebarHovered ? 1 : 0.4,
            transition: "opacity 0.3s ease"
          }}
        />

        <div
          style={{
            padding: collapsed ? "12px 6px" : "16px 12px",
            textAlign: "center",
            borderBottom: `1px solid ${colorPrimary}06`,
            background: `linear-gradient(135deg, ${colorPrimary}03, transparent)`,
            position: "relative",
            zIndex: 1,
          }}
        >
          {collapsed ? (
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setCollapsed(false)}>
              <Tooltip title="Expand Menu" placement="right">
                <Avatar
                  size={40}
                  src={logo}
                  style={{
                    cursor: "pointer",
                    border: `2px solid ${colorPrimary}15`,
                    transition: "all 0.3s ease",
                    pointerEvents: "auto",
                  }}
                  className="logo-avatar"
                />
              </Tooltip>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)", // Center perfectly
                  width: 46, // Slightly larger than Avatar size (40 + 2*3 for border)
                  height: 46, // Equal width and height for perfect circle
                  border: `1px solid ${colorPrimary}30`,
                  borderRadius: "50%", // Ensure circular shape
                  animation: "pulse 2s ease-in-out infinite",
                  zIndex: -1, // Behind Avatar
                  boxSizing: "border-box", // Prevent border affecting dimensions
                }}
              />
            </div>
          ) : (
            <div
              style={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
              }}
              onClick={() => setCollapsed(true)}
              className="logo-container"
            >
              <Image
                height={isTablet ? 100 : 120}
                preview={false}
                src={logo}
                style={{
                  borderRadius: 10,
                  filter: "drop-shadow(0 6px 15px rgba(0,0,0,0.1))",
                  transition: "all 0.3s ease",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "110%",
                  height: "110%",
                  background: `radial-gradient(circle, ${colorPrimary}15 0%, transparent 70%)`,
                  borderRadius: 12,
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  pointerEvents: "none",
                }}
                className="logo-glow"
              />
            </div>
          )}
        </div>

        <div
          style={{
            height: "calc(100vh - 110px)",
            overflowY: "auto",
            overflowX: "hidden",
            position: "relative",
            zIndex: 1
          }}
        >
          <Menu
            mode="inline"
            items={menuData}
            selectedKeys={[currentSelection]}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onClick={handleMenuClick}
            inlineIndent={12} // Reduced indent
            style={{
              border: "none",
              background: "transparent",
              fontSize: 13,
              padding: "10px 0"
            }}
          />
        </div>

        {!isMobile && !collapsed && (
          <div
            onMouseDown={handleResize}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 3,
              height: "100%",
              cursor: "col-resize",
              background: "transparent",
              zIndex: 10,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${colorPrimary}50`;
              e.currentTarget.style.width = "5px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.width = "3px";
            }}
          />
        )}
      </Sider>

      <Layout>
        <Header
          style={{
            padding: isTablet ? "0 16px" : "0 24px", // Reduced padding
            background: headerScrolled
              ? `linear-gradient(135deg, ${colorBgContainer}ee 0%, ${colorPrimary}06 100%)`
              : `linear-gradient(135deg, ${colorBgContainer} 0%, ${colorPrimary}02 100%)`,
            borderBottom: `1px solid ${headerScrolled ? colorPrimary + '15' : colorPrimary + '06'}`,
            display: "flex",
            alignItems: "center",
            height: 64,
            position: "sticky",
            top: 0,
            zIndex: 98,
            boxShadow: headerScrolled
              ? "0 6px 20px rgba(0,0,0,0.1)"
              : "0 2px 10px rgba(0,0,0,0.03)",
            backdropFilter: "blur(15px)",
            transition: "all 0.3s ease"
          }}
        >
          {isMobile && (
            <Button
              type="text"
              icon={collapsed ? <MenuOutlined /> : <CloseOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                marginRight: 12,
                borderRadius: 10,
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: ' systematized_data_type="text/plain">place-items: center',
                background: `linear-gradient(135deg, ${colorPrimary}08, ${colorPrimary}04)`,
                border: `1px solid ${colorPrimary}15`,
                fontSize: 14,
                transition: 'all 0.3s ease'
              }}
              className="mobile-toggle"
              size="large"
            />
          )}

          <div style={{ flex: 1 }} />

          <div style={{
            flex: 2,
            display: "flex",
            justifyContent: "center",
            maxWidth: 450
          }}>
            {!isTablet && (
              <div style={{ width: "100%", position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    top: -1,
                    left: -1,
                    right: -1,
                    bottom: -1,
                    background: `linear-gradient(45deg, ${colorPrimary}15, transparent, ${colorPrimary}15)`,
                    borderRadius: 12,
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    pointerEvents: "none"
                  }}
                  className="search-glow"
                />
                <GlobalSearch />
              </div>
            )}
          </div>

          <div style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center"
          }}>
            <Space size="large">
              {isTablet && (
                <Tooltip title="Search">
                  <Button
                    type="text"
                    icon={<SearchOutlined />}
                    size="large"
                    style={{
                      borderRadius: 10,
                      width: 38,
                      height: 38,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${colorPrimary}06, transparent)`,
                      border: `1px solid ${colorPrimary}12`,
                      transition: 'all 0.3s ease'
                    }}
                    className="search-button"
                  />
                </Tooltip>
              )}

              <Popover
                content={userMenu}
                trigger="click"
                placement="bottomRight"
                overlayStyle={{
                  borderRadius: 14,
                  marginTop: 6
                }}
                overlayClassName="user-menu-popover"
              >
                <Button
                  type="text"
                  style={{
                    padding: "4px 10px", // Reduced padding
                    height: "45px",
                    border: `1px solid ${colorPrimary}12`,
                    borderRadius: 12,
                    transition: "all 0.3s ease",
                    background: `linear-gradient(135deg, ${colorBgContainer} 0%, ${colorPrimary}03 100%)`,
                    backdropFilter: "blur(8px)",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  className="user-button"
                >
                  <Space size={10}>
                    <div style={{ position: "relative" }}>
                      <Avatar
                        size={34}
                        icon={<UserOutlined />}
                        style={{
                          backgroundColor: colorPrimary,
                          border: `1px solid ${colorPrimary}20`,
                          transition: "all 0.3s ease"
                        }}
                      />
                    </div>
                    {!isTablet && (
                      <Text style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#1f2937'
                      }}>
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
          style={{
            background: "linear-gradient(135deg, #f9fafb 0%, #f1f5f9 100%)",
            minHeight: "calc(100vh - 128px)",
            overflowX: "hidden",
            position: "relative",
            padding: isTablet ? 16 : 24 // Added responsive padding
          }}
        >
          <Outlet />
        </Content>

        <Footer
          style={{
            textAlign: "center",
            padding: isTablet ? "12px" : "16px 24px", // Reduced padding
            fontSize: 12,
            color: "#64748b",
            background: `linear-gradient(135deg, ${colorBgContainer} 0%, ${colorPrimary}02 100%)`,
            borderTop: `1px solid ${colorPrimary}08`,
            position: "relative"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${colorPrimary}15, transparent)`
            }}
          />
          <Text
            type="secondary"
            style={{
              fontWeight: 500,
              letterSpacing: "0.5px"
            }}
          >
            © {new Date().getFullYear()} DBL Group. All rights reserved.
          </Text>
        </Footer>
      </Layout>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1); /* Maintain centering */
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.15); /* Zoom out slightly */
    opacity: 0.7; /* Subtle fade for effect */
  }
}     
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes rotate {
          from { transform: translate(50%, -50%) rotate(0deg); }
          to { transform: translate(50%, -50%) rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .ant-menu-item, .ant-menu-submenu-title {
          border-radius: 10px !important;
          margin: 2px 8px !important;
          padding: 0 12px !important;
          height: 38px !important;
          line-height: 38px !important;
          transition: all 0.3s ease !important;
          position: relative !important;
          overflow: hidden !important;
        }
        
        .ant-menu-item::before, .ant-menu-submenu-title::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, ${colorPrimary}15, transparent);
          transition: left 0.4s ease;
        }
        
        .ant-menu-item:hover::before, .ant-menu-submenu-title:hover::before {
          left: 100%;
        }
        
        .ant-menu-item:hover, .ant-menu-submenu-title:hover { 
          background: linear-gradient(135deg, ${colorPrimary}10, ${colorPrimary}06) !important;
          transform: translateX(6px) !important;
          box-shadow: 0 4px 15px ${colorPrimary}20 !important;
        }
        
        .ant-menu-item-selected { 
          background: linear-gradient(135deg, ${colorPrimary}15, ${colorPrimary}10) !important;
          border: 1px solid ${colorPrimary}30 !important;
          font-weight: 600 !important;
          color: ${colorPrimary} !important;
          transform: translateX(4px) !important;
          box-shadow: 0 6px 20px ${colorPrimary}25 !important;
        }
        
        .ant-menu-item-selected::after {
          border-right: 3px solid ${colorPrimary} !important;
          border-radius: 2px !important;
        }

        .ant-btn {
          position: relative !important;
          overflow: hidden !important;
          transition: all 0.3s ease !important;
        }
        
        .ant-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
          transition: all 0.3s ease;
          transform: translate(-50%, -50%);
          borderRadius: 50%;
        }
        
        .ant-btn:hover::before {
          width: 250px;
          height: 250px;
        }

        .ant-btn:hover {
          transform: translateY(-1px) scale(1.01) !important;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1) !important;
        }

        .ant-btn:active {
          transform: translateY(1px) scale(0.99) !important;
        }

        .user-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transition: left 0.5s ease;
        }
        
        .user-button:hover::before {
          left: 100%;
        }
        
        .user-button:hover {
          border-color: ${colorPrimary}80 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px ${colorPrimary}15 !important;
        }

        .mobile-toggle::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: ${colorPrimary}25;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.3s ease;
        }
        
        .mobile-toggle:active::after {
          width: 80px;
          height: 80px;
        }

        .search-button:hover {
          background: linear-gradient(135deg, ${colorPrimary}12, ${colorPrimary}06) !important;
          transform: translateY(-1px) !important;
        }

        .logo-avatar:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 6px 20px ${colorPrimary}30 !important;
        }
        
        .logo-container:hover {
          transform: scale(1.03) !important;
        }
        
        .logo-container:hover .logo-glow {
          opacity: 1 !important;
        }

        .ant-menu-item, .ant-menu-submenu {
          animation: slideInLeft 0.3s ease-out !important;
        }
        
        .ant-menu-item:nth-child(1) { animation-delay: 0.05s !important; }
        .ant-menu-item:nth-child(2) { animation-delay: 0.1s !important; }
        .ant-menu-item:nth-child(3) { animation-delay: 0.15s !important; }
        .ant-menu-item:nth-child(4) { animation-delay: 0.2s !important; }
        .ant-menu-item:nth-child(5) { animation-delay: 0.25s !important; }

        .ant-popover-inner {
          border-radius: 14px !important;
          box-shadow: 0 15px 50px rgba(0,0,0,0.1) !important;
          border: 1px solid ${colorPrimary}08 !important;
          backdrop-filter: blur(15px) !important;
          overflow: hidden !important;
        }
        
        .ant-popover-arrow::before {
          background: linear-gradient(135deg, ${colorBgContainer}, ${colorPrimary}03) !important;
          border: 1px solid ${colorPrimary}08 !important;
        }

        .menu-button:hover {
          background: linear-gradient(135deg, ${colorPrimary}06, ${colorPrimary}03) !important;
          transform: translateX(3px) !important;
          border-left: 2px solid ${colorPrimary} !important;
        }
        
        .logout-button:hover {
          background: linear-gradient(135deg, #fee2e2, #fed7d7) !important;
          transform: translateX(3px) !important;
          border-left: 2px solid #ef4444 !important;
          color: #dc2626 !important;
        }

        .search-glow:focus-within {
          opacity: 1 !important;
        }

        ::-webkit-scrollbar { 
          width: 6px; 
          height: 6px;
        }
        ::-webkit-scrollbar-track { 
          background: linear-gradient(180deg, transparent, ${colorPrimary}03, transparent); 
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb { 
          background: linear-gradient(135deg, ${colorPrimary}50, ${colorPrimary}70);
          border-radius: 3px; 
          transition: all 0.3s ease;
        }
        ::-webkit-scrollbar-thumb:hover { 
          background: linear-gradient(135deg, ${colorPrimary}70, ${colorPrimary}90);
        }

        .ant-avatar {
          transition: all 0.3s ease !important;
        }

        .ant-avatar:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
        }

        .ant-spin-dot {
          animation: spin 1s infinite linear !important;
        }

        @media (max-width: 768px) {
          .ant-layout-header { 
            padding: 0 12px !important; 
            height: 56px !important;
          }
          .ant-layout-content > div { 
            margin: 6px !important; 
            padding: 12px !important; 
          }
        }
        
        @media (max-width: 480px) {
          .ant-layout-header { 
            padding: 0 8px !important; 
          }
          .ant-layout-content > div { 
            margin: 4px !important; 
            padding: 8px !important; 
          }
        }

        @media (prefers-color-scheme: dark) {
          .ant-layout {
            background: #111827 !important;
          }
          
          .ant-menu-item:hover, .ant-menu-submenu-title:hover {
            background: linear-gradient(135deg, ${colorPrimary}15, ${colorPrimary}10) !important;
          }
        }

        .ant-menu-item, .ant-menu-submenu-title, .ant-btn, .ant-avatar {
          will-change: transform !important;
        }

        .ant-btn:focus, .ant-menu-item:focus, .ant-input:focus {
          outline: 2px solid ${colorPrimary}30 !important;
          border-radius: 20px !important;
          padding: 0 14px !important;
          outline-offset: 1px !important;
        }

        @media (prefers-contrast: high) {
          .ant-menu-item-selected {
            border: 2px solid ${colorPrimary} !important;
          }
          
          .ant-btn {
            border: 2px solid currentColor !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `,
        }}
      />
    </Layout>
  );
};