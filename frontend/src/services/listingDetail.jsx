import {API_HOST, ajaxGet, ajaxPost} from 'services/config';

class ListingDetailService {

	getHomesData(address_url, room_id) {
		return ajaxGet(`${API_HOST}/ajax/homes/${address_url}/${room_id}`);
	}
	
	getSimilarData(room_id) {
		return ajaxGet(`${API_HOST}/ajax/homes/similar/${room_id}`);
	}
	
	getPhotosData(room_id) {
		return ajaxGet(`${API_HOST}/ajax/homes/photos/${room_id}`);
	}

	getUnavailableCalendarInHome(room_id) {
		return ajaxGet(`${API_HOST}/ajax/homes/${room_id}/unavailable_calendar`);
	}

	getUnavailableCalendarInRoom(room_id?) {
		return ajaxGet(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/get_unavailable_calendar`);
	}

	getUnavailableCalendarWithSeasonal(room_id?, seasonal_name?) {
		return ajaxPost(`${API_HOST}/ajax/rooms/manage-listing/${room_id}/unavailable_calendar`, { seasonal_name: seasonal_name });
	}

	getPriceCalculation(
		checkin?,
		checkout?,
		number_of_guests?,
		room_id?
	) {
		let data = {
			checkin: checkin,
			checkout: checkout,
			guest_count: number_of_guests,
			room_id: room_id
		};
		return ajaxPost(`${API_HOST}/ajax/rooms/price_calculation`, data);
	}
	
	fetchRequestBooking(
		checkin?,
		checkout?,
		number_of_guests?,
		room_id?,
		request_user_id?
	) {
		let data = {
			checkin: checkin,
			checkout: checkout,
			guest_count: number_of_guests,
			room_id: room_id,
			request_user_id: request_user_id
		};
		return ajaxPost(`${API_HOST}/ajax/book/request/${room_id}`, data);
	}

	getWishlistData(room_id) {
		return ajaxGet(`${API_HOST}/ajax/wishlist_list?id=${room_id}`);
	}

	getWishlistCreate(wishContext?, room_id?) {
		let data = {
			data: wishContext,
			id: room_id
		};
		return ajaxPost(`${API_HOST}/ajax/wishlist_create`, data);
	}

	getWishlistSave(room_id?, saved_id?, wishlist_id?) {
		let data = {
			data: room_id,
			saved_id: saved_id,
			wishlist_id: wishlist_id
		}
		return ajaxPost(`${API_HOST}/ajax/save_wishlist`, data);
	}

	getHomeReview(room_id?) {
		return ajaxGet(`${API_HOST}/ajax/homes/review/${room_id}`);
	}

	getHouseType(room_id?) {
		return ajaxGet(`${API_HOST}/ajax/homes/housetype/${room_id}`);
	}

	getAmenityType(room_id?) {
		return ajaxGet(`${API_HOST}/ajax/homes/amenities_type/${room_id}`);
	}

	getHomeDescription(room_id?) {
		return ajaxGet(`${API_HOST}/ajax/homes/descriptions/${room_id}`);
	}

	getSeasonalRate(room_id?) {
		return ajaxGet(`${API_HOST}/ajax/homes/seasonal_rate/${room_id}`);
	}

	sendMailOwner(room_id) {
		return ajaxGet(`${API_HOST}/ajax/rooms/send-mail-owner/${room_id}`);
	}
}

export const listingDetailService = new ListingDetailService();