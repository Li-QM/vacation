import React from 'react';
import { toast } from 'react-toastify';

class AlertService {
	showSuccess(title, content = 'Successful!') {
		toast.success(<div dangerouslySetInnerHTML={{ __html : title + '<br/>' + content }}></div>);
	}
	
	showWarning(title, content = '') {
		toast.error(<div dangerouslySetInnerHTML={{ __html : title + '<br/>' + content }}></div>);
	}

	showError(title, content = 'Not Successful!') {
		toast.error(<div dangerouslySetInnerHTML={{ __html : title + '<br/>' + content }}></div>);
	}
}

export const alertService = new AlertService();