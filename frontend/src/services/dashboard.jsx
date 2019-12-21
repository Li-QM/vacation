import {API_HOST, ajaxGet, ajaxPost, ajaxPostForm} from 'services/config';

class DashboardService {
  /////////////////////////////////////////////////
  // Dashboard Content
  /////////////////////////////////////////////////
  getContent() {
    return ajaxGet(`${API_HOST}/ajax/dashboard/index`);
  }

  /////////////////////////////////////////////////
  // Listings
  /////////////////////////////////////////////////
  getRoomList() {
    return ajaxGet(`${API_HOST}/ajax/dashboard/getlistings`);
  }

  getRoomData(id, ba_roomid) {
    return ajaxGet(`${API_HOST}/ba/api/set_baroomid?roomid=${id}&&ba_roomid=${ba_roomid}`);
  }

  // TODO: Add Data
  changeRoomState(data) {
    return ajaxPost(`${API_HOST}/ajax/change_status_of_room`, data);
  }

  getRoomReservation(data = null) {
    if (data) {
      return ajaxGet(`${API_HOST}/ajax/dashboard/my_reservations` + data);
    } else {
      return ajaxGet(`${API_HOST}/ajax/dashboard/my_reservations`);
    }
  }

  acceptReservation(id, data) {
    return ajaxPost(`${API_HOST}/ajax/reservation/accept/${id}`, data);
  }

  declineReservation(id, data) {
    return ajaxPost(`${API_HOST}/ajax/reservation/decline/${id}`, data);
  }

  /////////////////////////////////////////////////
  // Trips
  /////////////////////////////////////////////////
  getOldTripList() {
    return ajaxGet(`${API_HOST}/ajax/dashboard/getOldTripsList`);
  }

  geCurrTripList() {
    return ajaxGet(`${API_HOST}/ajax/dashboard/getcurrentTripsList`);
  }

  /////////////////////////////////////////////////
  // Profile
  /////////////////////////////////////////////////
  removeUserPhoneNubmer(req) {
    return ajaxPost(`${API_HOST}/ajax/removeUserPhoneNumber`, req);
  }
  saveUserProfile(req) {
    return ajaxPost(`${API_HOST}/ajax/saveuserprofile`, req);
  }
  uploadProfilePhoto(req) {
    return ajaxPostForm(`${API_HOST}/ajax/profilepictureupload`, req);
  }
  getVerification() {
    return ajaxGet(`${API_HOST}/ajax/dashboard/getverifycation`);
  }
  updateVerifyCode(req) {
    return ajaxPost(`${API_HOST}/ajax/sendVerifyCode`, req);
  }
  verifyPhoneNumber(req) {
    return ajaxPost(`${API_HOST}/ajax/verifyPhoneNumber`, req);
  }

  /////////////////////////////////////////////////
  // Booking Automation
  /////////////////////////////////////////////////
  getBACredential() {
    return ajaxGet(`${API_HOST}/ba/account/get_ba_credential`);
  }

  submitBAKeys(req) {
    return ajaxPost(`${API_HOST}/ba/account/register`, req);
  }

  updateBAKeys() {
    return ajaxGet(`${API_HOST}/ba/api/update`);
  }

  /////////////////////////////////////////////////
  // API Keys
  /////////////////////////////////////////////////
  getApiKey() {
    return ajaxGet(`${API_HOST}/ajax/dashboard/getapikeys`);
  }

  generateApiKey() {
    return ajaxPost(`${API_HOST}/ajax/dashboard/generateapikeys`);
  }
}

export const dashboardService = new DashboardService();