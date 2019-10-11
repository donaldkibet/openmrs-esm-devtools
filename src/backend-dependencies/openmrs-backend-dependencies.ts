import { openmrsFetch } from "@openmrs/esm-api";
import * as semver from "semver";
import { difference, isEmpty } from "lodash-es";

let installedBackendModules: any[] = [];
let missingBackedModules: MissingBackenModules[] = [];
let misMatchingBackendModules: any[] = [];

const originalOnload = System.constructor.prototype.onload;

System.constructor.prototype.onload = function(err, id, deps) {
  const moduleName = id.substring(id.lastIndexOf("/") + 1, id.indexOf(".js"));
  if (!err) {
    System.import(id)
      .then(response => {
        const module = Object.assign({ moduleName }, response);
        if (module.backendDependencies) {
          checkBackendDeps(module);
        }
      })
      .catch(err => {
        setTimeout(() => {
          throw err;
        });
      });
  }
  return originalOnload.apply(this, arguments);
};

function checkBackendDeps(module: any) {
  if (isEmpty(installedBackendModules)) {
    fetchInstalledBackendModules()
      .then(({ data }) => {
        installedBackendModules = data.results;
        checkIfModulesAreInstalled(module);
      })
      .catch(err => {
        setTimeout(() => {
          throw err;
        });
      });
  } else {
  }
}

function checkIfModulesAreInstalled(module) {
  let missingBackendModule = getMissingBackendModules(
    module.backendDependencies
  );
  let InstallAndRequiredModules = getInstalledAndRequiredBackendModules(
    module.backendDependencies
  );
  missingBackedModules.push({
    moduleName: module.moduleName,
    MissingModules: missingBackendModule
  });
  misMatchingBackendModules.push({
    moduleName: module.moduleName,
    missMatchingModules: getMisMatchedBackendModules(InstallAndRequiredModules)
  });
}

function fetchInstalledBackendModules() {
  return openmrsFetch(`/ws/rest/v1/module?v=custom:(uuid,version)`, {
    method: "GET"
  });
}

function getMissingBackendModules(requiredBackendModules) {
  const requiredBackendModulesUuids = Object.keys(requiredBackendModules);
  const installedBackendModuleUuids = installedBackendModules.map(
    res => res.uuid
  );
  let missingModules = difference(requiredBackendModulesUuids, installedBackendModuleUuids);
  return requiredBackendModulesUuids.map(key => {
    return { uuid: key, version: requiredBackendModules[key] };
  });
}

function getInstalledAndRequiredBackendModules(requiredBackendModules) {
  let requiredBackendModulesUuids = Object.keys(requiredBackendModules);
  let requiredBackendModule = Object.keys(requiredBackendModules).map(key => {
    return { uuid: key, version: requiredBackendModules[key] };
  });
  let installedAndRequiredBackendModules = requiredBackendModule.filter(
    module => {
      return requiredBackendModulesUuids.find(uuid => {
        return module.uuid === uuid;
      });
    }
  );
  return installedAndRequiredBackendModules;
}

function getMisMatchedBackendModules(installedAndRequiredBackendModules) {
  let misMatchedBackendModules: MisMatchingModules[] = [];
  for (let uuid in installedAndRequiredBackendModules) {
    const installedVersion = installedBackendModules[uuid].version;
    const requiredVersion = installedAndRequiredBackendModules[uuid].version;
    const moduleName = installedAndRequiredBackendModules[uuid].uuid;

    if (!isVersionInstalled(requiredVersion, installedVersion)) {
      misMatchedBackendModules.push({
        uuid: moduleName,
        requiredVersion: requiredVersion,
        installedVersion: installedVersion
      });
    }
  }
  return misMatchedBackendModules;
}

function isVersionInstalled(requiredVersion, installedVersion) {
  return semver.gte(
    semver.coerce(requiredVersion),
    semver.coerce(installedVersion)
  );
}

interface BackendModule {
  uuid: string;
  version: string;
}

interface MisMatchingModules {
  uuid: string;
  installedVersion: string;
  requiredVersion: string;
}
interface MissingBackenModules {
  moduleName: string;
  MissingModules: BackendModule[];
}

console.log(missingBackedModules);

export { missingBackedModules, misMatchingBackendModules };
