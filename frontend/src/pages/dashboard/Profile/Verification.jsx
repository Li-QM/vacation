import React from 'react';
import { Link } from 'react-router-dom';

import { dashboardService } from 'services/dashboard';
import { alertService } from 'services/alert';
import 'assets/styles/pages/dashboard/verification.scss';

class Verification extends React.Component{
  constructor(props){
  super(props)
  this.state = {
    user_info : {},
    verification : {},
    phone_numbers : []
  }
  this.handleChangeVerifyCode = this.handleChangeVerifyCode.bind(this)
  this.handleProcessVerify = this.handleProcessVerify.bind(this)
  this.SendEmailVerifyLink = this.SendEmailVerifyLink.bind(this)
  }
  componentDidMount() {
		dashboardService.getVerification().then(res => {
			if (res) {
				this.setState({
					user_info : res.user_info,
					verification : res.verifycation,
					phone_numbers : res.phone_numbers
				})
			} else {
				alertService.showError('Get verification');
			}
		})
  }
  handleSendVerifyCode(e, index) {
    e.preventDefault();
		const req = {
			phone_number_id : this.state.phone_numbers[index].id
		}
		dashboardService.updateVerifyCode(req).then(res => {
			if (res) {
				alertService.showSuccess('Update verify code');
			} else {
				alertService.showError('Update verify code');
			}
		})
    // Axios.post('/ajax/sendVerifyCode', { phone_number_id : this.state.phone_numbers[index].id})    
  }
  SendEmailVerifyLink() {

  }
  handleChangeVerifyCode(e, index){
  let value = e.target.value;
  let phone_numbers = this.state.phone_numbers;
  phone_numbers[index].verification_code = value;
  this.setState({
    phone_numbers : phone_numbers
  })
  }
  handleProcessVerify(e, index){
  e.preventDefault();
	const req = {
		phone_number_id : this.state.phone_numbers[index].id, 
		code : this.state.phone_numbers[index].verification_code
	}
	dashboardService.verifyPhoneNumber(req).then(res => {
		if(res && res.status === 'success') {
			alertService.showSuccess(res.message);
			this.setState({
				phone_numbers : res.phone_numbers
			})
		} else {
			alertService.showError(res.message, '');
		}
	})
  // Axios.post('/ajax/verifyPhoneNumber', { phone_number_id : this.state.phone_numbers[index].id, code : this.state.phone_numbers[index].verification_code})
  // .then(response =>{
  //   if(response.data.status == 'success'){
  //   toast.success(response.data.message)
  //   }
  //   else{
  //   toast.error(response.data.message)
  //   }
  //   this.setState({
  //   phone_numbers : response.data.phone_numbers
  //   })
  // })
  }
  render() {
    return (
			<div className="col-md-12 p-0 m-0">
				<div id="dashboard-content">
					<div className="panel verified-container">
						<div className="panel-header">
							Your Current Verifications
						</div>
						<div className="panel-body">
							<ul className="list-layout edit-verifications-list">
								<li className="edit-verifications-list-item clearfix email verified">
									<h4>Email Address</h4>
									{
										this.state.verification.email === 'yes' ?  <p className="description">You have confirmed your email: <b>{this.state.user_info.email}</b>.  A confirmed email is important to allow us to securely communicate with you.
										</p> : 
										<div className='form-group -auto mt-1' >
											<div className="alert alert-dismissible  show" role="alert">
												<strong>Note!</strong>Your Email does not verified! Please click 
												<Link to="#" onClick={this.SendEmailVerifyLink} className='font-weight-bold' style={{ cursor : 'pointer' }}><code>Here</code></Link>
												to send verify link.
											</div>
										</div>
									}
								</li>
								<li className="edit-verifications-list-item clearfix email verified">
									<h4>Phone Number</h4>
									{
										this.state.phone_numbers.length === 0 ?
										<div className="alert alert-dismissible  show" role="alert">
											<strong>Note!</strong> Please save your phone numbers in profile page. It is important for community of vacation.rentals.
											<button type="button" className="close" data-dismiss="alert" aria-label="Close">
												<span aria-hidden="true">×</span>
											</button>
										</div>
										: null
									}
								</li>
								{
									this.state.phone_numbers.map((phone_number, index) =>{
										return  <div className=' ' key={index}>
										<p></p>
										{
											phone_number.status !== 'Confirmed' ? 
											<form  className="form-inline">
												<label className="mr-sm-2 mb-0">Phone Number</label>
												<label className="mr-sm-2 mb-0">
													<strong>{phone_number.phone_number_protected.replace(/ /g,'')}</strong> : 
												</label>
												
												{/* <label className="mr-sm-2 mb-0" htmlFor="last_name">Last Name</label> */}
												<input type="text" className="form-control mr-sm-2 mb-2 mb-sm-0" onChange={(event) => this.handleChangeVerifyCode(event, index)} id="last_name" name="last_name" placeholder='Verify Code' />
												<div className='form-group  ml-auto mt-3'>
												<button type="button" className="btn btn-primary mt-2 mt-sm-0" onClick={(event)=>this.handleSendVerifyCode(event, index)}>Send Code</button>
												<button type="button" className="btn btn-primary mt-2 mt-sm-0" onClick={(event)=>this.handleProcessVerify(event, index)}>Verify</button>
												</div>
											</form>
											: 
											<p className="description">You have confirmed your phone number: <b>{phone_number.phone_number_protected.replace(/ /g,'')}</b>.
											</p>
										}
									</div>
									})
								}
							</ul>
						</div>
					</div>
				</div>
			</div>
    )
  }
}

export default Verification;