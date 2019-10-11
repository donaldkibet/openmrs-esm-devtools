import React from "react";
import {
  missingBackedModules,
  misMatchingBackendModules
} from "./openmrs-backend-dependencies";
import styles from "../devtools/import-map.styles.css";
import backendStyles from "./backend-dependencies-style.css";

export default function BackendModule(props: BackendModulesProps) {
  handleBackendModuleErrorToggle(props);
  return (
    <div className={styles.importMap}>
      <div className={backendStyles}>
        <h4>Missing openmrs backend modules</h4>

        {Object.keys(missingBackedModules).map(key => {
          return (
            <table>
              <tr>
                {missingBackedModules[key].MissingModules.length >
                  0 && (
                  <tr>
                    <tr>
                      <td colSpan={3}>
                        <b>{missingBackedModules[key].moduleName}</b>
                      </td>
                    </tr>
                    <tr>
                      <td><b>Module Name</b></td>
                      <td><b>Version</b></td>
                    </tr>
                    {Object.values(
                      missingBackedModules[key].MissingModules
                    ).map((module: any) => {
                      return (
                        <tr>
                          <td>{module.uuid}</td>
                          <td>{module.version}</td>
                        </tr>
                      );
                    })}
                  </tr>
                )}
              </tr>
            </table>
          );
        })}

        <h4>Modules with wrong versions installed</h4>

        {Object.keys(misMatchingBackendModules).map(key => {
          return (
            <table>
              <tr>
                {misMatchingBackendModules[key].missMatchingModules.length >
                  0 && (
                  <tr>
                    <tr>
                      <td colSpan={3}>
                        <b>{misMatchingBackendModules[key].moduleName}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Module Name</td>
                      <td>Installed Version</td>
                      <td>Required Version</td>
                    </tr>
                    {Object.values(
                      misMatchingBackendModules[key].missMatchingModules
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
  Object.keys(misMatchingBackendModules).every(key => {
    props.toggleOverridden(
      misMatchingBackendModules[key].missMatchingModules.length > 0
    );
  });
  Object.keys(missingBackedModules).every(key => {
    props.toggleOverridden(missingBackedModules[key].MissingModules.length > 0);
  });
}

type BackendModulesProps = {
  toggleOverridden(overridden: boolean): void;
};
