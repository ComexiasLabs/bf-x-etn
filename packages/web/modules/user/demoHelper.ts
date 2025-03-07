import logger from '@core/logger/logger';
import { createDemoProfile } from '@services/web/demoService';

export interface PrepareDemoUserResponse {
  isSuccessful: boolean;
  token: string;
  userId: string;
}

export const prepareDemoUser = async (): Promise<PrepareDemoUserResponse> => {
  logger.logInfo('prepareDemoUser', 'Begin');

  try {
    const demoResponse = await createDemoProfile();
    if (!demoResponse) {
      return {
        token: '',
        userId: '',
        isSuccessful: false,
      };
    }

    return {
      token: demoResponse.token,
      userId: demoResponse.userId,
      isSuccessful: true,
    };
  } catch (e) {
    logger.logWarning('authenticateDemoUser', 'Failed to create demo profile.', e);
    return {
      token: '',
      userId: '',
      isSuccessful: false,
    };
  }
};
