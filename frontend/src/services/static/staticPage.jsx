import { API_HOST, ajaxGet } from 'services/config';

class StaticPageService {
	getPageContent(slug) {
		return ajaxGet(`${API_HOST}/ajax/get/page/${slug}`);
	}

	getStateListing(page_name, page_area) {
		return ajaxGet(`${API_HOST}/ajax/pages/getStateListings/${page_name}/${page_area}`);
	}

	getCityListing(page_name, page_area) {
		return ajaxGet(`${API_HOST}/ajax/pages/getCityListings/${page_name}/${page_area}`);
	}

}

export const staticPageService = new StaticPageService();