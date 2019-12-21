import {API_HOST, ajaxGet, ajaxPost} from './config';

class SearchService {
  searchIndex(data) {
    return ajaxPost(`${API_HOST}/ajax/searchIndex`, data, true);
  }

  searchResult(page, data) {
    if (page) {
      return ajaxPost(`${API_HOST}/ajax/searchResult?page=${page}`, data);
    } else {
      return ajaxPost(`${API_HOST}/ajax/searchResult`, data);
    }
  }

  getRooms(room_id) {
    return ajaxGet(`${API_HOST}/ajax/homes/${room_id}`, true);
  }
}

export const searchService = new SearchService();


