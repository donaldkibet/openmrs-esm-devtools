import * as React from "react";
import {
  missingBackenModules,
  misMatchingBackendModules
} from "./openmrs-backend-dependencies";
import styles from "../devtools/import-map.styles.css";
import backendStyles from "./backend-dependencies-style.css";

export default function BackendModule() {
  return (
    <div className={styles.importMap}>
      <div className={backendStyles}>
        <h5>Missing openmrs backend modules</h5>
        <ol>
          {Object.keys(missingBackenModules).map(key => {
            return (
              <div>
                {missingBackenModules[key].MissingModules.length > 0 && (
                  <li>
                    {missingBackenModules[key].moduleName}
                    <ul>
                      {Object.values(
                        missingBackenModules[key].MissingModules
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
                {misMatchingBackendModules[key].missMatchingModules.length > 0 && (
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
