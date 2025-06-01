import { App } from "antd";
import { RouterProvider } from "react-router";
import { routers } from "./router";
import { ConfigProvider, theme } from "antd";
import { useAppSelector } from "./app/store/store";
import { globalTheme } from "./app/slice/themeSlice";
import { useRef } from "react";
import "./App.css";
import CommonModal from "./components/modal/CommonModal";

function MyApp() {
  const themeApp = useAppSelector(globalTheme);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  return (
    <ConfigProvider
      theme={{
        // algorithm: themeApp.theme,
        token: {
          colorPrimary: "#1775BB",
          colorBgContainer:
            themeApp.theme === theme.defaultAlgorithm ? "#F8F8F8" : "#F8F8F8", //#0b1120cc, #0d1117,#121212
        },
      }}
      getPopupContainer={() => modalContainerRef.current as HTMLElement}
    >
      <App>
        <div ref={modalContainerRef}>
          <RouterProvider router={routers} />
          <CommonModal />
        </div>
      </App>
    </ConfigProvider>
  );
}
export default MyApp;
