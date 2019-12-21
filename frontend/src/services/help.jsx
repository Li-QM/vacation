import {API_HOST, ajaxPost} from './config';

class HelpService {
  getHelpListByCategory(room_id) {
    return ajaxPost(`${API_HOST}/ajax/getHelpListByCategory`);
  }

	helpSearch(req) {
		return ajaxPost(`${API_HOST}/ajax/helpSearch`, req);
	}
}

export const helpService = new HelpService();
