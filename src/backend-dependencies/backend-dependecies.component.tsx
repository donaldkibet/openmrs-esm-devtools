import React from "react";
import {
  missingBackendModules,
  modulesWithWrongVersion
} from "../openmrs-backend-dependencies";
import styles from "../devtools/import-map.styles.css";
import backendStyles from "./backend-dependencies-style.css";

export default function BackendModule(props: BackendModulesProps) {
  handleBackendModuleErrorToggle(props);
  return (
    <div className={styles.importMap}>
      <div className={backendStyles}>
        <h4>Missing openmrs backend modules</h4>

        {Object.keys(missingBackendModules).map(key => {
          return (
            <table className={backendStyles.table}>
              {missingBackendModules[key].backendModules.length > 0 && (
                <tr>
                  <tr>
                    <td colSpan={3}>
                      <b>{missingBackendModules[key].moduleName}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Module Name</b>
                    </td>
                    <td>
                      <b>Version</b>
                    </td>
                  </tr>
                  {Object.values(missingBackendModules[key].backendModules).map(
                    (module: any) => {
                      return (
                        <tr>
                          <td>{module.uuid}</td>
                          <td>{module.version}</td>
                        </tr>
                      );
                    }
                  )}
                </tr>
              )}
            </table>
          );
        })}

        <h4>Modules with wrong versions installed</h4>

        {Object.keys(modulesWithWrongVersion).map(key => {
          return (
            <table>
              <tr>
                {modulesWithWrongVersion[key].backendModules.length > 0 && (
                  <tr>
                    <tr>
                      <td colSpan={3}>
                        <b>{modulesWithWrongVersion[key].moduleName}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Module Name</td>
                      <td>Installed Version</td>
                      <td>Required Version</td>
                    </tr>
                    {Object.values(
                      modulesWithWrongVersion[key].backendModules
                    ).map((module: any) => {
                      return (
                        <tr>
                          <td>{module.uuid}</td>
                          <td>{module.installedVersion}</td>
                          <td>{module.requiredVersion}</td>
                        </tr>
                      );
                    })}
                  </tr>
                )}
              </tr>
            </table>
          );
        })}
      </div>
    </div>
  );
}

function handleBackendModuleErrorToggle(props) {
  Object.keys(modulesWithWrongVersion).every(key => {
    if (modulesWithWrongVersion[key].backendModules.length > 0)
      props.toggleOverridden(true);
  });
  Object.keys(missingBackendModules).every(key => {
    if (missingBackendModules[key].backendModules.length > 0)
      props.toggleOverridden(true);
  });
}

type BackendModulesProps = {
  toggleOverridden(overridden: boolean): void;
};
