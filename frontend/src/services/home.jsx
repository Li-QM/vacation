import {API_HOST, ajaxGet} from './config';

class HomeService {
  getHomeData() {
    return ajaxGet(`${API_HOST}/ajax/home/index`, true);
  }
}

export const homeService = new HomeService();
