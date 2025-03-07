import { App, ContractDeployments } from '@modules/firebase';
import { Environments } from '@core/enums/environments';

export const isAppDeployed = (app: App): boolean => {
  return app.deployments?.length > 0;
};

export const isAppDeployedToEnvironment = (app: App, environment: Environments): boolean => {
  if (!app) {
    return;
  }

  if (app.deployments) {
    return app.deployments.find((item) => item.environment === environment) ? true : false;
  } else {
    return false;
  }
};

export const getDeploymentForEnvironment = (app: App, environment: Environments): ContractDeployments => {
  if (!app.deployments) {
    return null;
  }

  return app.deployments.find((item) => item.environment === environment);
};
