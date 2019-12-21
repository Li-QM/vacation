import React from 'react';

import { authService } from 'services/auth';
import { setCookie } from 'services/config';
import { alertService } from 'services/alert';

class VerifyUser extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
		const user_id = this.props.match.params.id;
		authService.verifyUser(user_id).then(res => {
			if (res) {
				console.log(res)
				if (res.success) {
					setCookie('is_loged_in', 'true', 1);
          setCookie('user_name', res.userinfo.first_name, 1);
          setCookie('user_id', res.userinfo.id, 1);
          setCookie('user_type', res.userinfo.user_type, 1);
          setCookie('token', res.token, 1);
					window.location.href = '/';
				} else {
					alertService.showError(res.msg, '');
				}
			}
		})
  }

  render() {
    return <div style={{display: 'none'}}></div>
  }
}

export default VerifyUser;