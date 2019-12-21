import {API_HOST, ajaxGet, ajaxPost, getCookie} from 'services/config';

class ChatService {
  /* Inbox / ChatBox */
  getContactLists() {
    return ajaxGet(`${API_HOST}/ajax/chat/getcontactlists?userId=` + getCookie('user_id'));
  }
	updateContactStatus(req) {
    // return ajaxPost(`${API_HOST}/ajax/chatcontact/updatestatus`, req);
    return '';
  }
	updateFile(req) {
    // return ajaxPost(`${API_HOST}/ajax/chat/fileupload`, req);
    return '';
  }
  getMessages(user_id, my_id) {
    return ajaxGet(`${API_HOST}/ajax/chat/getmessages?chat_id=${user_id}&my_id=${my_id}`);
  }
  readChatMessage(req) {
    // return ajaxPost(`${API_HOST}/ajax/chat/readMessage`, req);
    return '';
  }
  sendChatMessage(req) {
    // return ajaxPost(`${API_HOST}/ajax/chat/sendmessage`, req);
    return '';
  }
  sendTypingStatus(req) {
    // return ajaxPost(`${API_HOST}/ajax/chat/isTyping`, req);
    return '';
  }

  /* Contact us */
  getMail(req) {
    // return ajaxPost(`${API_HOST}/getMail`, req);
    return '';
  }

}

export const chatService = new ChatService();