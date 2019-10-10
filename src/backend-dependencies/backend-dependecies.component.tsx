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
        <h5>Missing openmrs backend modules</h5>
        <ol>
          {Object.keys(missingBackedModules).map(key => {
            return (
              <div>
                {missingBackedModules[key].MissingModules.length > 0 && (
                  <li>
                    {missingBackedModules[key].moduleName}
                    <ul>
                      {Object.values(
                        missingBackedModules[key].MissingModules
                      ).map(missingModule => {
                        return <li>{missingModule}</li>;
                      })}
                    </ul>
                  </li>
                )}
              </div>
            );
          })}
        </ol>

        <h5>Modules with wrong versions installed</h5>
        <ol>
          {Object.keys(misMatchingBackendModules).map(key => {
            return (
              <div>
                {misMatchingBackendModules[key].missMatchingModules.length >
                  0 && (
                  <li>
                    {misMatchingBackendModules[key].moduleName}
                    <ul>
                      {Object.values(
                        misMatchingBackendModules[key].missMatchingModules
                      ).map((module: any) => {
                        return (
                          <li>
                            {`${module.uuid} version ${module.installedVersion} installed but requires ${module.requiredVersion}`}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                )}
              </div>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function handleBackendModuleErrorToggle(props) {
  Object.keys(misMatchingBackendModules).every(key => {
    misMatchingBackendModules[key].missMatchingModules.length > 0
      ? props.toggleOverridden(true)
      : props.toggleOverridden(false);
  });
  Object.keys(missingBackedModules).every(key => {
    missingBackedModules[key].MissingModules.length > 0
      ? props.toggleOverridden(true)
      : props.toggleOverridden(false);
  });
}

type BackendModulesProps = {
  toggleOverridden(overridden: boolean): void;
};
