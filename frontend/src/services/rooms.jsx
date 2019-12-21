import {API_HOST, ajaxGet, ajaxPost} from './config';

class RoomsService {
  getStepstatus(room_id) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/rooms_steps_status`);
  }

  /* Room Basics */
  getBasicsData(room_id) {
    return ajaxGet(`${API_HOST}/ajax/rooms/manage_listing/${room_id}/basics`);
  }

  updateBedRoom(bedroom_data) {
    return ajaxPost(API_HOST + '/ajax/rooms/saveOrUpdate_bedroom', bedroom_data);
  }

  deleteBedRoom(bedroom_id, room_id) {
    return ajaxPost(API_HOST + '/ajax/rooms/delete_bedroom', {bedid : bedroom_id, room_id : room_id});
  };

  updateBathRoom(bathroom_data) {
    return ajaxPost(API_HOST + '/ajax/rooms/saveOrUpdate_bathroom', bathroom_data);
  }

  deleteBathRoom(bathroom_id, room_id) {
    return ajaxPost(API_HOST + '/ajax/rooms/delete_bathroom', {bathid : bathroom_id, room_id : room_id});
  }

  updatePrice(room_id, price_data) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/update_price`, {data: JSON.stringify(price_data)});
  }

  updateRooms(room_id, rooms_data) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/update_rooms`, rooms_data);
  }

  /* Room Calendar */
  getUnAvailableCalendar(room_id) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/unavailable_calendar`, {season_name: ''});
  }

  getSeasonalCalendar(room_id) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/seasonal_calendar`, {season_name: ''});
  }

  getCalendarData(room_id, year_fr, year_to) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/${year_fr}/${year_to}/get_calendar_data`);
  }

  getDailyPrices(room_id, year_fr, year_to) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/${year_fr}/${year_to}/get_daily_prices`);
  }
  
  importCalendar(room_id, import_data) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/calendar_import`, import_data);
  }

  saveUnavailableDates(room_id, data) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/save_unavailable_dates`, data);
  }

  saveReservation(room_id, data) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/save_reservation`, data);
  }

  saveSeasonalPrice(room_id, data) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/save_seasonal_price`, data);
  }

  deleteSeasonalPrice(room_id, data) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/delete_seasonal`, data);
  }

  deleteUnavailableDays(room_id, data) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/delete_not_available_days`, data);
  }

  deleteReservation(room_id, data) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/delete_reservation`, data);
  }

  getRoomsStepStatus(room_id) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/rooms_steps_status`, {});
  }
  
  /* Room Pricing */
  getAdditionalCharges(room_id) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/get_additional_charges`, {});
  }

  updateAdditionalPrice(data) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/update_additional_price`, data);
  }

  getLastMinRules(room_id) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/get_last_min_rules`, {id: room_id});
  }

  updatePriceRules(room_id, price_rule) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/update_price_rules/last_min`, {data: price_rule});
  }

  /* Room Location */
  getLocation(room_id) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/get_location`, {});
  }
  
  saveLocation(room_id, data) {
    return ajaxPost(`${API_HOST}/ajax/rooms/finish_address/${room_id}/location`, {data});
  }

  /* Room Description */
  getDescriptionLanguages(room_id) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/lan_description`);
  }

  getAllLanguages(room_id) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/get_all_language`);
  }

  addLanguage(room_id, req) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/add_description`, req);
  }

  deleteLanguage(room_id, req) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/delete_language`, req);
  }
  
  getRoomDescription(room_id) {
    return ajaxGet(`${API_HOST}/ajax/rooms/manage_listing/${room_id}/description`);
  }

  updateRoomPropertySummary(room_id, req) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/update_rooms`, req);
  }

  updateRoomDescription(room_id, req) {
    return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/update_description`, req);
  }

  getCancelMessage(room_id) {
		return ajaxGet(`${API_HOST}/ajax/manage_listing/${room_id}/get_cancel_message`);
	}

  /* Room Amenity */
  getAmenities(room_id) {
		return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/get_amenities`);
	}

  updateAmenities(room_id, req) {
		return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/update_amenities`, req);
	}

  /* Room Video */
  getVideoUrl(room_id) {
		return ajaxGet(`${API_HOST}/ajax/rooms/manage_listing/${room_id}/get_videoUrl`);
	}

  /* Room Photos */
  getPhotoList(room_id) {
    return ajaxGet(`${API_HOST}/ajax/manage-listing/${room_id}/photos_list`);
  }

  getFeaturePhoto(data) {
    return ajaxPost(`${API_HOST}/ajax/manage-listing/featured_image`, data);
  }

  updatePhoto(data) {
    return ajaxPost(`${API_HOST}/ajax/manage-listing/photo_highlights`, data);
  }

  changePhotoOrder(data) {
    return ajaxPost(`${API_HOST}/ajax/manage-listing/change_photo_order`, data);
  }

  deletePhoto(room_id, data) {
    return ajaxPost(`${API_HOST}/ajax/manage-listing/${room_id}/delete_photo`, data);
  }

  /* Room Publish */
  getMembershipTypes() {
    return ajaxGet(`${API_HOST}/ajax/membershiptypes`);
  }

  /* Room Subscribe */
  getPublishListing(room_id) {
    return ajaxGet(`${API_HOST}/ajax/rooms/getpublishlistings/${room_id}`);
  }

  setSubscribeProperty(room_id, req) {
    return ajaxPost(`${API_HOST}/ajax/rooms/post_subscribe_property/${room_id}`, req);
  }

}

export const roomsService = new RoomsService();
