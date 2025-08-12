import { Flex, Menu, Tabs } from "antd";
import { useEffect, useMemo, useState } from "react";
import BuildInfo from "./BuildInfo";
import Extension from "./Extension";
import Extensions from "./Extensions";
import ServerInfo from "./ServerInfo";
import { isExtensionInfo } from "./utils";

import "./App.css";

const EnvironmentValues = {
  Public: "https://hosting.portal.azure.net/api/diagnostics",
  Fairfax: "https://hosting.azureportal.usgovcloudapi.net/api/diagnostics",
  Mooncake: "https://hosting.azureportal.chinacloudapi.cn/api/diagnostics",
} as const;

const App: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<Diagnostics>();
  const [extension, setExtension] = useState<ExtensionInfo>();
  const [environment, setEnvironment] = useState<string>(
    EnvironmentValues.Public,
  );
  const [selectedTab, setSelectedTab] = useState("extensions");

  const environmentName = useMemo(() => {
    switch (environment) {
      case EnvironmentValues.Public:
        return "Public Cloud";
      case EnvironmentValues.Fairfax:
        return "Fairfax";
      case EnvironmentValues.Mooncake:
        return "Mooncake";
      default:
        return "Select environment";
    }
  }, [environment]);

  const showPaasServerless = useMemo(
    () => isExtensionInfo(diagnostics?.extensions["paasserverless"]),
    [diagnostics?.extensions],
  );

  const environments = useMemo(
    () => [
      {
        key: "public",
        text: "Public Cloud",
        selected: environment === EnvironmentValues.Public,
        onClick: () => {
          setEnvironment(EnvironmentValues.Public);
          setExtension(undefined);
        },
      },
      {
        key: "fairfax",
        text: "Fairfax",
        selected: environment === EnvironmentValues.Fairfax,
        onClick: () => {
          setEnvironment(EnvironmentValues.Fairfax);
          setExtension(undefined);
        },
      },
      {
        key: "mooncake",
        text: "Mooncake",
        selected: environment === EnvironmentValues.Mooncake,
        onClick: () => {
          setEnvironment(EnvironmentValues.Mooncake);
          setExtension(undefined);
        },
      },
    ],
    [environment],
  );

  const menuItems = useMemo(
    () =>
      environments.map((env) => ({
        key: env.key,
        label: env.text,
        onClick: env.onClick,
      })),
    [environments],
  );

  useEffect(() => {
    const getDiagnostics = async () => {
      const response = await fetch(environment);
      setDiagnostics(await response.json());
    };
    getDiagnostics();
  }, [environment]);

  if (!diagnostics) {
    return null;
  }

  const { buildInfo, extensions, serverInfo } = diagnostics;

  const handleLinkClick = (_?: React.MouseEvent, item?: KeyedNavLink) => {
    if (item) {
      const extension = extensions[item.key];
      if (isExtensionInfo(extension)) {
        setExtension(extension);
      }
    }
  };

  return (
    <>
      <Menu mode="horizontal">
        <Menu.SubMenu key="env-dropdown" title={environmentName}>
          {menuItems.map((item) => (
            <Menu.Item key={item.key} onClick={item.onClick}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu.SubMenu>
        {showPaasServerless && (
          <Menu.Item
            key="paasserverless"
            onClick={() => {
              const paasserverless = diagnostics.extensions["paasserverless"];
              if (isExtensionInfo(paasserverless)) {
                setExtension(paasserverless);
              }
            }}
          >
            paasserverless
          </Menu.Item>
        )}
        <Menu.Item
          key="websites"
          onClick={() => {
            const websites = diagnostics.extensions["websites"];
            if (isExtensionInfo(websites)) {
              setExtension(websites);
            }
          }}
        >
          websites
        </Menu.Item>
      </Menu>
      <Tabs
        activeKey={selectedTab}
        onChange={(key) => setSelectedTab(key)}
        style={{ marginBottom: 16 }}
      >
        <Tabs.TabPane tab="Extensions" key="extensions">
          <Flex style={{ flexDirection: "row", gap: "1rem" }}>
            <div>
              <Extensions
                extensions={extensions}
                onLinkClick={handleLinkClick}
              />
            </div>
            <div style={{ flexGrow: 1 }}>
              {extension && <Extension {...extension} />}
            </div>
          </Flex>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Build Information" key="build">
          <div style={{ padding: 10 }}>
            <BuildInfo {...buildInfo} />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Server Information" key="server">
          <div style={{ padding: 10 }}>
            <ServerInfo {...serverInfo} />
          </div>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default App;
