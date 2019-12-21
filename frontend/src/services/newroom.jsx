import {API_HOST, ajaxGet, ajaxPost} from './config';

class NewRoomService {
  getNewRoomData() {
    return ajaxGet(`${API_HOST}/ajax/rooms/new`);
  }

  createRoom(data) {
    return ajaxPost(API_HOST + '/ajax/rooms/create', data);
  }
}

export const newRoomService = new NewRoomService();
