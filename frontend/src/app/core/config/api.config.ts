import { environment } from '../../../environments/environment';

export const apiConfig = {
  baseUrl: environment.apiBaseUrl,
  storageKeys: {
    token: 'ordermanagement.accessToken'
  }
};
