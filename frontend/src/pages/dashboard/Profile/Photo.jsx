import React from 'react';

import { dashboardService } from 'services/dashboard';
import { alertService } from 'services/alert';
import 'assets/styles/pages/dashboard/profile-photo.scss';

class Photos extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			userinfo: {
				first_name: '',
				last_name: ''
			},
			page_data: {}

		}
		this.uploadPhoto = this.uploadPhoto.bind(this)
	}
	
	componentDidMount () {
		dashboardService.getContent().then(res => {
			if (res) {
				this.setState({
					userinfo: res.user_info,
					page_data: res.data
				})
			} else {
				alertService.showError('Get room information');
			}
		})
	}

	uploadPhoto (event) {
		const file = event.target.files[0];
		const formData = new FormData();
		formData.append('myFile', file, file.name);
		dashboardService.uploadProfilePhoto(formData).then(res => {
			if (res && res.status === 'success') {
				alertService.showSuccess(res.message, '');
				let { page_data } = this.state;
				page_data.profile_pic = res.file_url;
				this.setState({
					page_data: page_data
				})
			} else {
				alertService.showError('Upload profile photo');
			}
		})
	}

	render () {
		let { page_data } = this.state;

		return (
			<div className="col-md-12 m-0 p-0">
				<div className="aside-main-content">
					<div className="side-cnt">
						<div className="head-label">
							<h4>Profile Photo</h4>
						</div>
						<div className="aside-main-cn">
							<div className="photo-profile_">
								<div className="form-wrapper">
									<form name="ajax_upload_form" method="post" id="ajax_upload_form" className="form" encType="multipart/form-data">
										<div className="user-profile">
											<img src={page_data.profile_pic} className="img-responsive" alt="profile" />
										</div>
										<div className="small-info">
											<p>Part of the trust factor is clearly identifying who you are to
												your guests. A clear photo of yourself is a great way to start
                      the process</p>
											<div className="file">
												<input type="file" name="file" id="file" onChange={this.uploadPhoto} />
												<label htmlFor="file" className="btn btn-outline-primary">
													Upload your image
													{/* <i className="far fa-image fa-2x" /> */}
													<svg width="28" height="28" viewBox="0 0 2048 1792" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '10px'}}>
														<path fill="#23537a" d="M704 576q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm1024 384v448h-1408v-192l320-320 160 160 512-512zm96-704h-1600q-13 0-22.5 9.5t-9.5 22.5v1216q0 13 9.5 22.5t22.5 9.5h1600q13 0 22.5-9.5t9.5-22.5v-1216q0-13-9.5-22.5t-22.5-9.5zm160 32v1216q0 66-47 113t-113 47h-1600q-66 0-113-47t-47-113v-1216q0-66 47-113t113-47h1600q66 0 113 47t47 113z"/>
													</svg>
												</label>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Photos;