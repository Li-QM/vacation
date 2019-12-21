import {API_HOST, ajaxGet, ajaxPost} from './config';

class PaymentService {
  get(data) {
    return ajaxPost(`${API_HOST}/ajax/searchIndex`, data, true);
  }
}

export const paymentService = new PaymentService();


