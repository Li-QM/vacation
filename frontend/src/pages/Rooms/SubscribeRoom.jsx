import React, { Suspense } from 'react';
import { Redirect, Link } from 'react-router-dom';
import LoadingScreen from 'react-loading-screen';
import { Elements, StripeProvider } from 'react-stripe-elements';

import ScriptCache from 'shared/ScriptCache';
import { roomsService } from 'services/rooms';
import { alertService } from 'services/alert';
import { STRIPE_KEY } from 'services/config';
import 'assets/styles/rooms/room_subscribe.scss';

import StripeSubscribeRoom from 'components/rooms/subscribe/StripeSubscribeRoom';
import PayPalCheckout from 'components/rooms/subscribe/PaypalButton';

// let ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;
const TAB_MENU = ['Stripe, PayPal', 'Bank'];

class SubscribeRoom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listings: [],
      plan_type: {},
      plan_types: [],
      result: {},
      publish_listings: [], //[parseFloat(this.props.match.params.room_id)],
      room_id: this.props.match.params.room_id,
      default_listing_fee: null,
      additional_fee: null,
      isLoading : true ,
      is_redirect : false,
      strip_api_loaded: false,
      tab_state: TAB_MENU[0],
    }
    this.handleSelectListing = this.handleSelectListing.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleChangeMembership = this.handleChangeMembership.bind(this)
    this.SuccessPaypalSubscribe = this.SuccessPaypalSubscribe.bind(this)
  }
  componentDidMount() {
    window.requestAnimationFrame( () => {
			new ScriptCache([`https://js.stripe.com/v3/`]).onLoad( ()=> {
				this.setState({
					strip_api_loaded: true,
				});
			});

		roomsService.getPublishListing(this.props.match.params.room_id)
			.then(res => {
				if (res) {
					this.setState({
						listings: res.listings,
						plan_types: res.plan_types,
						result: res.result,
						room_id: res.room_id,
						isLoading : false
					});
				} else {
					alertService.showError('Get publish listing');
				}
			})
			.catch(error => {
				alertService.showError('Get publish listing');
			})
		});
  }

  SuccessPaypalSubscribe(listing_id) {
    let listings = this.state.listings
    let publish_listings = this.state.publish_listings;
    let listing_index = publish_listings.indexOf(listing_id);

    listings.map((listing, index) => {
      if (listing.id === listing_id) {
        listings[index].status = 'Subscribed';
      }
			return null;
    })

    if (listing_index !== -1) {
      publish_listings.splice(listing_index, 1)
    }

    this.setState({
      listings : listings,
      publish_listings : publish_listings
    })
  }

  handleSelectListing(event, listingId) {
    let { publish_listings } = this.state;
    let listing_index = publish_listings.indexOf(listingId);

    if (listing_index !== -1) {
      publish_listings.splice(listing_index, 1)
    } else {
      publish_listings.push(listingId)
    }
    this.setState({
      publish_listings: publish_listings
    })
  }

  handleChangeMembership(listing_index, listing_id, event) {
    let value = event.target.value;
    let { listings } = this.state;
    listings[listing_index].membership_type = value;

    this.setState({
      listings: listings
    })
  }
  onSubmit(token, coupon_code) { 
    console.log('token => ', token, 'coupon=>', coupon_code);
    if (token) {
      let listings  = this.state.listings.map((listing) => {
        if (listing.status !== 'Subscribed') return listing;
				return null;
      });
			let req = {
				token: token,
				coupon_code: coupon_code,
				listings: listings,
				publish_listings: this.state.publish_listings
			};
			roomsService.setSubscribeProperty(this.props.match.params.room_id, req).then(res => {
				if (res && res.status === 'success') {
					alertService.showSuccess('Subscribed successfully!', '');
					window.location.href = '/dashboard/room-listing';
				} else {
					alertService.showError(res.message, '');
				}
			});
    } else {
      alertService.showError('Cannot generate token!', '');
    }
  }

  render() {
    let total_price = 0;
    if(this.state.is_redirect) {
      return <Redirect to='/dashboard/room-listing'/>;
    }
    
    if (this.state.isLoading) {
      return(
        <LoadingScreen
          loading={true}
          bgColor='#f1f1f1'
          spinnerColor='#9ee5f8'
          textColor='#676767'
					children=''
          logoSrc='https://cdn2.iconfinder.com/data/icons/large-svg-icons-part-2/512/real_estate_vector_symbol-512.png'
          text='Payment Initializing! Please wait a few seconds.'
        >
        </LoadingScreen>
      )
    } else if (this.state.listings === undefined || this.state.listings.length === 0) {
      return (
        <div className='container mt-5 p-5'>
          <h4>No rooms to publish!</h4>
        </div>
      )
    } else {
			const current_room_membership = (
				this.state.listings.map((listing, listing_index) => {
					if (listing.id === this.props.match.params.room_id && listing.status !== 'Subscribed') {
						return <div className="row listing_item pb-3" key={listing_index}>
							<div className="col-md-4">
								<Link to="#">
									<img className="img-fluid rounded mb-3 mb-md-0" src={listing.featured_image} alt="Feature"/>
								</Link>
							</div>
							<div className="col-md-8">
								<h3 className="listing_detail ml-0">{listing.name}</h3>
								<h3 className="listing_detail ml-0">ID:{listing.id}</h3>
								<div className="form-group row">
									<label className="col-md-4 text-white">Membership:</label>
									<select className="col-md-8 p-0 pl-2 bg-primary text-white" value={listing.membership_type} onChange={(e) => { this.handleChangeMembership(listing_index, listing.id, e) }} >
										<option value={0}>Please Select</option>
										{
											this.state.plan_types.map((plan, index) => {
												return <option key={index} value={plan.id}>{plan.Name}</option>
											})
										}
									</select>
								</div>
								<Link className="redirect_to_listing" to="#">Manage Listing</Link>
							</div>
						</div>
					}
					return null;
				})
			);
			const other_room_membership = (
				this.state.listings.map((listing, listing_index) => {
					if (listing.id !== this.props.match.params.room_id  && listing.status !== 'Subscribed') {
						return <div className="row listing_item mt-3 pb-3" key={listing_index}>
							<div className="col-md-4">
								<Link to="#">
									<img className="img-fluid rounded mb-3 mb-md-0" src={listing.featured_image} alt="Feature"/>
								</Link>
							</div>
							<div className="col-md-8">
								<h3 className="listing_detail ml-0">{listing.name}</h3>
								<h3 className="listing_detail ml-0">ID:{listing.id}</h3>
								<div className="form-group row">
									<label className="col-md-4 text-white">Membership:</label>
									<select className="col-md-8 p-0 pl-2 bg-primary text-white" value={listing.membership_type} onChange={(e) => { this.handleChangeMembership(listing_index, listing.id, e) }} >
										<option value={0}>Please Select</option>
										{
											this.state.plan_types.map((plan, index) => {
												return <option key={index} value={plan.id}>{plan.Name}</option>
											})
										}
									</select>
								</div>
								<div className="custom-control custom-checkbox mb-3">
									<input type="checkbox" className="custom-control-input" id={"listing_checkbox_" + listing_index} name="example1" onChange={(e) => this.handleSelectListing(e, listing.id)} />
									<label className="custom-control-label listing_detail  p-1" htmlFor={"listing_checkbox_" + listing_index}>Do you want to publish this listing?</label>
								</div>
								<Link className="redirect_to_listing" to="#">Manage Listing</Link>
							</div>
						</div>
					}
					return null;
				})
			);
			const membership_content = (
				this.state.plan_types.map((membership, membership_index) => {
					let count_membership = 0;
					for (let iiii = 0; iiii < this.state.listings.length; iiii++) {
						if (
                 Number(this.state.listings[iiii].membership_type) === membership.id
              && this.state.publish_listings.indexOf(this.state.listings[iiii].id) !== -1
              && this.state.listings[iiii].status !== 'Subscribed'
            ) {
							count_membership++;
						}
					}
					if (count_membership) {
						total_price += membership.annual_fee * count_membership
						return <div className="row listing_item mt-3 pb-3" key={membership_index}>
							<div className="col-md-6 listing_detail">{membership.Name}</div>
							<div className="col-md-3 listing_detail">${membership.annual_fee} × {count_membership} </div>
							<div className="col-md-3 listing_detail">${membership.annual_fee * count_membership} </div>
						</div>
					}
					return null;
				})
			);
			const total_price_list = (
				<div className="row listing_item mt-3 pb-3"  >
					<div className="col-md-6 col-sm-4 listing_detail">Total</div>
					<div className="col-md-3 col-sm-4 listing_detail"></div>
					<div className="col-md-3 col-sm-4 listing_detail">${total_price}</div>
				</div>
			);
      const tab_nav = (
        <ul className="nav bg-light nav-pills rounded nav-fill mb-3" role="tablist">
          <li className="nav-item">
            <div 
              className={ this.state.tab_state === TAB_MENU[0] ? "nav-link active show" : "nav-link" }
              onClick={() => this.setState({tab_state: TAB_MENU[0]})}
            >
              <svg className="stripe-icon" viewBox="0 0 56.48 56.48" version="1.1" preserveAspectRatio="xMidYMid">
                <g>
                  <g>
                    <path d="M36.782,27.008c-0.061-0.457-0.35-0.603-0.793-0.473c-0.103,0.03-0.202,0.074-0.306,0.107
                      c-0.182,0.056-0.252,0.161-0.25,0.366c0.011,1.169,0.005,2.341,0.005,3.513c0,0.205,0,0.41,0,0.605
                      c0.721,0.264,1.146,0.065,1.295-0.654C36.97,29.325,36.935,28.164,36.782,27.008z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M55.026,9.939H1.454C0.65,9.939,0,10.59,0,11.393v33.694c0,0.803,0.65,1.455,1.454,1.455h53.572
                      c0.804,0,1.454-0.651,1.454-1.454V11.393C56.48,10.591,55.83,9.939,55.026,9.939z M14.008,30.844
                      c-0.171,1.633-1.086,2.487-2.73,2.637c-1.067,0.098-2.101-0.043-3.122-0.331c-0.088-0.024-0.216-0.134-0.217-0.206
                      c-0.016-0.719-0.01-1.436-0.01-2.184c0.52,0.11,1.011,0.233,1.51,0.309c0.308,0.048,0.632,0.065,0.938,0.018
                      c0.16-0.022,0.352-0.181,0.43-0.328c0.108-0.207,0.008-0.439-0.193-0.565c-0.265-0.166-0.554-0.295-0.83-0.444
                      c-0.32-0.173-0.655-0.324-0.95-0.533c-0.582-0.41-0.921-0.984-1.014-1.698c-0.009-0.066-0.035-0.131-0.054-0.196
                      c0-0.178,0-0.354,0-0.532c0.048-0.238,0.08-0.482,0.146-0.715c0.31-1.107,1.121-1.652,2.184-1.869
                      c1.132-0.23,2.251-0.131,3.351,0.223c0.176,0.057,0.245,0.138,0.241,0.331c-0.013,0.669-0.005,1.338-0.005,1.998
                      c-0.56-0.102-1.099-0.21-1.642-0.292c-0.22-0.032-0.462-0.048-0.672,0.009c-0.152,0.04-0.358,0.199-0.379,0.331
                      c-0.024,0.156,0.079,0.398,0.208,0.497c0.238,0.183,0.536,0.284,0.805,0.428c0.347,0.182,0.714,0.343,1.028,0.572
                      C13.894,28.935,14.115,29.844,14.008,30.844z M18.84,30.526c0.048,0.402,0.197,0.539,0.603,0.515
                      c0.353-0.02,0.703-0.074,1.088-0.117c0,0.777,0,1.524,0,2.308c-1.118,0.206-2.238,0.444-3.378,0.168
                      c-1.007-0.244-1.562-1.07-1.575-2.32c-0.015-1.468-0.005-2.937-0.005-4.405c0-0.106,0-0.21,0-0.339c-0.402,0-0.774,0-1.17,0
                      c0-0.694,0-1.368,0-2.07c0.379,0,0.759,0,1.166,0c0.123-0.607,0.249-1.191,0.354-1.779c0.035-0.198,0.102-0.305,0.314-0.352
                      c0.853-0.191,1.7-0.405,2.583-0.617c0,0.915,0,1.805,0,2.729c0.584,0,1.141,0,1.727,0c-0.146,0.71-0.285,1.382-0.428,2.076
                      c-0.421,0-0.832,0-1.272,0c-0.007,0.117-0.017,0.211-0.017,0.305c-0.001,1.202,0,2.404,0,3.606
                      C18.83,30.333,18.829,30.432,18.84,30.526z M26.765,26.952c-0.361-0.045-0.682-0.094-1.004-0.123
                      c-0.165-0.013-0.335-0.002-0.5,0.019c-0.675,0.088-0.766,0.194-0.766,0.859c0,1.764,0,3.527,0,5.291c0,0.106,0,0.212,0,0.335
                      c-1.089,0-2.149,0-3.233,0c0-3.01,0-6.019,0-9.054c0.066-0.007,0.14-0.022,0.214-0.022c0.7-0.002,1.399,0.005,2.099-0.006
                      c0.183-0.003,0.288,0.054,0.366,0.22c0.1,0.213,0.225,0.413,0.344,0.626c0.598-0.948,1.2-1.19,2.216-0.919
                      c0.191,0.05,0.274,0.125,0.271,0.337C26.76,25.322,26.767,26.129,26.765,26.952z M30.782,33.34c-1.077,0-2.137,0-3.221,0
                      c0-3.039,0-6.048,0-9.07c1.08,0,2.14,0,3.221,0C30.782,27.292,30.782,30.31,30.782,33.34z M29.189,23.15c-0.002,0-0.004,0-0.004,0
                      c-0.131,0.002-0.265-0.015-0.396-0.048c-0.29-0.073-0.543-0.219-0.741-0.414c-0.307-0.298-0.498-0.715-0.498-1.176
                      c0-0.82,0.603-1.5,1.39-1.619c0.02-0.008,0.039-0.014,0.059-0.02c0.118,0,0.237,0,0.355,0c0.007,0.004,0.015,0.007,0.023,0.012
                      c0.816,0.093,1.45,0.785,1.45,1.627C30.827,22.416,30.094,23.148,29.189,23.15z M39.882,31.075
                      c-0.017,0.066-0.037,0.133-0.057,0.198c-0.466,1.503-1.409,2.224-2.98,2.239c-0.457,0.006-0.916-0.08-1.399-0.127
                      c0,1.062,0,2.142,0,3.223c-1.085,0-2.169,0-3.253,0c-0.006-0.098-0.012-0.196-0.012-0.295c0-3.902,0-7.805,0-11.707
                      c0-0.106,0-0.212,0-0.351c0.541,0,1.051,0,1.561,0c0.079,0,0.157,0.006,0.236-0.001c0.525-0.042,1.037-0.054,1.277,0.578
                      c0.118-0.082,0.197-0.134,0.275-0.189c0.841-0.59,1.765-0.685,2.734-0.418c0.629,0.174,1.041,0.613,1.322,1.187
                      c0.307,0.629,0.436,1.305,0.496,1.994C40.189,28.638,40.197,29.866,39.882,31.075z M45.06,31.01
                      c0.779,0.121,1.547-0.041,2.314-0.168c0.259-0.043,0.519-0.093,0.82-0.146c0,0.571,0,1.121,0,1.668c0,0.717,0,0.716-0.696,0.892
                      c-1.21,0.302-2.428,0.358-3.657,0.112c-1.379-0.276-2.226-1.128-2.58-2.46c-0.369-1.387-0.371-2.793,0.008-4.177
                      c0.466-1.701,1.606-2.55,3.509-2.635c0.974-0.043,1.911,0.101,2.667,0.804c0.621,0.576,0.938,1.324,1.047,2.134
                      c0.125,0.923,0.149,1.861,0.221,2.845c-1.543,0-2.989,0-4.427,0C44.2,30.518,44.467,30.919,45.06,31.01z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M45.476,26.416c-0.091-0.442-0.632-0.533-0.927-0.19c-0.092,0.107-0.17,0.254-0.188,0.392
                      c-0.062,0.483-0.096,0.971-0.141,1.478c0.492,0,0.92,0,1.449,0C45.607,27.518,45.589,26.956,45.476,26.416z"/>
                  </g>
                </g>
              </svg>
              <span>Stripe</span>
            </div>
          </li>
          <li className="nav-item">
            <div 
              className={ this.state.tab_state === TAB_MENU[1] ? "nav-link active show" : "nav-link" }
              data-toggle="pill"
              onClick={() => this.setState({tab_state: TAB_MENU[1]})}
            >
              {/* <i className="fa fa-cc-paypal" />  */}
              <svg className="paypal-icon" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.48 56.48">
                <g>
                  <g>
                    <path d="M12.121,24.861c-0.229-0.15-0.57-0.226-1.018-0.226l-0.383,0.002c-0.251-0.002-0.508,0.2-0.557,0.444l-0.353,1.52
                      c-0.055,0.246,0.102,0.447,0.356,0.447h0.286c0.635,0,1.127-0.129,1.48-0.389c0.353-0.258,0.534-0.625,0.526-1.1
                      C12.46,25.245,12.347,25.01,12.121,24.861z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M18.371,28.364c-0.069,0.002-0.598,0.062-0.866,0.095c-0.3,0.043-0.56,0.103-0.771,0.174l-0.496,0.338
                      c-0.116,0.146-0.171,0.332-0.171,0.571l0.226,0.438c0.153,0.086,0.379,0.128,0.667,0.128c0.19,0,0.396-0.046,0.612-0.134
                      l0.46-0.237l0.182-0.242c0.072-0.282,0.221-0.909,0.238-0.987L18.371,28.364z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M55.026,9.939H1.454C0.65,9.939,0,10.59,0,11.393v33.694c0,0.803,0.65,1.455,1.454,1.455h53.572
                      c0.804,0,1.454-0.651,1.454-1.454V11.393C56.48,10.59,55.83,9.939,55.026,9.939z M13.484,27.695
                      c-0.796,0.586-1.904,0.878-3.336,0.88H9.814c-0.257,0-0.508,0.202-0.561,0.444l-0.402,1.738c-0.057,0.248-0.308,0.446-0.562,0.446
                      h-1.17c-0.254,0-0.413-0.204-0.353-0.446l1.645-7.163c0.06-0.246,0.309-0.443,0.563-0.447l2.444-0.001
                      c0.528,0.005,0.985,0.037,1.381,0.109c0.39,0.074,0.73,0.198,1.018,0.374c0.276,0.174,0.499,0.407,0.639,0.689
                      c0.156,0.282,0.225,0.635,0.225,1.055C14.681,26.333,14.286,27.109,13.484,27.695z M20.746,26.781l-0.044,0.301l-0.854,3.692
                      c-0.05,0.222-0.27,0.411-0.503,0.438l-0.016,0.006H19.16h-0.898h-0.021l-0.004-0.004c-0.223-0.021-0.361-0.21-0.313-0.438v-0.002
                      l0.002-0.007l0.044-0.188l-0.006-0.007l-0.441,0.291l-0.48,0.268l-0.566,0.194c-0.174,0.042-0.419,0.067-0.735,0.067
                      c-0.499,0-0.917-0.137-1.233-0.42c-0.314-0.289-0.476-0.658-0.476-1.11c0-0.48,0.111-0.886,0.334-1.224
                      c0.231-0.336,0.561-0.598,1.007-0.794c0.415-0.189,0.914-0.329,1.484-0.408c0.582-0.084,1.062-0.145,1.727-0.187l0.168-0.104
                      l0.021-0.165c0-0.254-0.118-0.429-0.353-0.532c-0.238-0.1-0.596-0.15-1.064-0.15c-0.318-0.004-0.718,0.061-1.097,0.147
                      c-0.397,0.09-0.506,0.149-0.7,0.207c-0.09,0.031-0.307,0.046-0.226-0.33l0.143-0.589c0,0,0.07-0.445,0.515-0.542
                      c0.215-0.048,0.249-0.057,0.6-0.111c0.475-0.073,0.945-0.11,1.416-0.11c0.953,0,1.651,0.124,2.092,0.373
                      c0.443,0.248,0.669,0.636,0.667,1.157L20.746,26.781z M22.627,34.055l-1.212,0.002c-0.252,0-0.335-0.2-0.181-0.446l1.037-1.808
                      c0,0,0.083-0.103,0.009-0.693c-0.16-1.066-0.956-5.598-0.956-5.598c-0.058-0.245,0.098-0.446,0.35-0.446l1.049-0.002
                      c0.321,0,0.579,0.211,0.637,0.459l0.522,3.143l0.194,0.002c0.163-0.289,1.839-3.165,1.839-3.165
                      c0.16-0.242,0.484-0.447,0.736-0.447c0,0,1.127,0.003,1.404,0c0.416-0.006-0.032,0.668-0.032,0.668l-4.664,7.887
                      C23.209,33.857,22.877,34.055,22.627,34.055z M34.744,27.726c-0.799,0.583-1.912,0.878-3.344,0.878h-0.334
                      c-0.252-0.004-0.504,0.201-0.562,0.443l-0.396,1.741c-0.058,0.243-0.314,0.443-0.562,0.44l-1.173,0.003
                      c-0.249,0.001-0.413-0.201-0.353-0.444l1.646-7.167c0.06-0.243,0.306-0.441,0.56-0.445l2.447-0.002
                      c0.525,0.002,0.987,0.039,1.375,0.108c0.395,0.072,0.735,0.196,1.019,0.373c0.279,0.179,0.498,0.408,0.644,0.692
                      c0.15,0.28,0.223,0.634,0.225,1.054C35.936,26.359,35.535,27.133,34.744,27.726z M42.002,26.786l-0.043,0.303l-0.856,3.689
                      c-0.048,0.223-0.269,0.412-0.499,0.44l-0.016,0.006H40.42c-0.242,0-0.752,0-0.899,0H39.5l-0.002-0.006
                      c-0.227-0.021-0.367-0.209-0.312-0.438l-0.002-0.003l0.005-0.004l0.039-0.188l-0.007-0.009l-0.438,0.295L38.3,31.138l-0.565,0.191
                      c-0.174,0.045-0.42,0.064-0.733,0.069c-0.5,0-0.914-0.142-1.232-0.423c-0.316-0.286-0.479-0.657-0.479-1.111
                      c0-0.477,0.111-0.885,0.335-1.221c0.229-0.336,0.564-0.597,1.006-0.795c0.418-0.19,0.92-0.328,1.487-0.408
                      c0.578-0.084,1.058-0.145,1.728-0.186l0.168-0.106l0.018-0.165c0-0.252-0.116-0.429-0.354-0.531
                      c-0.238-0.101-0.596-0.151-1.062-0.151c-0.32-0.002-0.721,0.062-1.099,0.147c-0.395,0.092-0.502,0.149-0.695,0.207
                      c-0.098,0.029-0.309,0.046-0.229-0.33l0.143-0.588c0,0,0.067-0.446,0.514-0.542c0.217-0.047,0.252-0.058,0.602-0.109
                      c0.472-0.076,0.945-0.113,1.416-0.113c0.949,0,1.646,0.126,2.091,0.375c0.446,0.248,0.669,0.634,0.669,1.155L42.002,26.786z
                      M45.752,23.679l-1.568,7.101l-0.055,0.084c-0.093,0.2-0.291,0.362-0.506,0.362h-1.088l-0.02-0.025
                      c-0.207-0.032-0.342-0.199-0.293-0.417l-0.002-0.005l0.047-0.205l1.466-6.662l0.052-0.232l0.059-0.091
                      c0.095-0.196,0.289-0.355,0.504-0.355h1.047c0.255,0,0.408,0.199,0.354,0.443L45.752,23.679z M47.83,22.911h-0.392v0.521
                      l0.003,0.14l0.027,0.094l0.062,0.06l0.12,0.019l0.098-0.014l0.073-0.022h0.009v0.171l-0.117,0.023l-0.111,0.009l-0.266-0.095
                      l-0.091-0.3v-0.606h-0.132v-0.162h0.132v-0.325h0.193v0.325h0.392V22.911z M49.725,23.15v0.737h-0.189v-0.65l-0.012-0.139
                      l-0.025-0.11l-0.066-0.065L49.306,22.9l-0.159,0.041l-0.163,0.103l0.003,0.056l0.002,0.06v0.729h-0.19v-0.65l-0.008-0.141
                      l-0.027-0.109L48.7,22.924l-0.129-0.023l-0.157,0.039l-0.159,0.099v0.85h-0.188V22.75h0.188v0.127l0.182-0.116l0.188-0.042
                      l0.198,0.047l0.122,0.136l0.21-0.141l0.205-0.042l0.277,0.113l0.09,0.318H49.725z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M39.628,28.37c-0.069-0.001-0.596,0.061-0.86,0.095c-0.303,0.043-0.562,0.102-0.771,0.174
                      c-0.214,0.084-0.388,0.197-0.501,0.338c-0.112,0.146-0.168,0.332-0.168,0.572l0.229,0.437c0.146,0.087,0.369,0.129,0.666,0.129
                      c0.187,0,0.393-0.046,0.608-0.133l0.457-0.237l0.188-0.242c0.07-0.285,0.222-0.91,0.234-0.988L39.628,28.37z"/>
                  </g>
                </g>
                <g>
                  <g>
                    <path d="M33.372,24.888c-0.231-0.151-0.567-0.225-1.016-0.227l-0.381,0.002c-0.252-0.002-0.508,0.202-0.56,0.445l-0.354,1.519
                      c-0.057,0.244,0.106,0.448,0.359,0.446h0.291c0.633,0,1.124-0.13,1.478-0.384c0.35-0.261,0.528-0.625,0.526-1.104
                      C33.709,25.273,33.6,25.038,33.372,24.888z"/>
                  </g>
                </g>
              </svg>
              Paypal
            </div>
          </li>
        </ul>
      )
      const tab_pane_stripe = (
        <div className={ this.state.tab_state === TAB_MENU[0] ? "tab-pane active show" : "tab-pane"} id="nav-tab-card">
          {this.state.strip_api_loaded && 
            <Suspense fallback={<div>Loading...</div>}>
              <Elements>
                <StripeSubscribeRoom room_id={this.props.match.params.room_id} onSubmit={(token, card_data) => this.onSubmit(token, card_data)}/>
              </Elements>
            </Suspense>
          }
        </div>
      );
      const tab_pane_paypal = (
        <div className={ this.state.tab_state === TAB_MENU[1] ? "tab-pane active show" : "tab-pane" } id="nav-tab-paypal">
          <p>Paypal subscribe!</p>
          {
            this.state.listings.map((listing, index) => {
              return (
                listing.status !== 'Subscribed'
                && this.state.publish_listings.includes(listing.id)
                && listing.membership_type
                && listing.membership_type !== '0'
                && listing.id === Number(this.props.match.params.room_id)
                ? ( 
                    <div className='mt-4' key={index} >
                      <h5>{listing.name}</h5>
                      <h6 className='mt-1 mb-1'>Room ID : {listing.id}</h6>
                      <h6 className='mt-1 mb-1'>Membership : {
                        this.state.plan_types.map(plan => {
                          return plan.id === parseFloat(listing.membership_type) ? plan.Name : null
                        })
                      }</h6>
                      <h6 className='mt-1 mb-1'>Price : {
                        this.state.plan_types.map(plan => {
                          return plan.id === parseFloat(listing.membership_type) ? '$' + plan.annual_fee : null
                        })
                      }</h6>
                      <PayPalCheckout paymentSuccess={()=>this.SuccessPaypalSubscribe(listing.id)} planId={parseFloat(listing.membership_type)} room_id={listing.id}/>
                      <hr/>
                    </div>
                  )
                : null
              )
            })
          }
          {
            this.state.listings.map((listing, index) =>{
              return (
                listing.status !== 'Subscribed'
                && this.state.publish_listings.includes(listing.id)
                && listing.membership_type 
                && listing.membership_type !== '0' 
                && listing.id !== Number(this.props.match.params.room_id)
                ? (
                    <div className='mt-4'  key={index} >
                      <h5>{listing.name}</h5>
                      <h6 className='mt-1 mb-1'>Room ID : {listing.id}</h6>
                      <h6 className='mt-1 mb-1'>
                        Membership : {
                        this.state.plan_types.map(plan =>{
                          return plan.id === parseFloat(listing.membership_type) ? plan.Name : null
                        })
                      }
                      </h6>
                      <h6 className='mt-1 mb-1'>
                        Price : {
                        this.state.plan_types.map(plan =>{
                          return plan.id === parseFloat(listing.membership_type) ? '$' + plan.annual_fee : null
                        })
                      }
                      </h6>
                      <PayPalCheckout paymentSuccess={()=>this.SuccessPaypalSubscribe(listing.id)} planId={parseFloat(listing.membership_type)} room_id={listing.id}/>
                      <hr/>
                    </div>
                  )
                : null
              )
            })
          }
          <p></p>
          <p><strong>Note:</strong> You must subscribe for every listings. </p>
        </div>
      )
      const tab_pane_bank = (
        <div className={ this.state.tab_state === TAB_MENU[2] ? "tab-pane active show" : "tab-pane" } id="nav-tab-bank">
          <p>Bank accaunt details</p>
          <dl className="param">
            <dt>BANK: </dt>
            <dd> THE WORLD BANK</dd>
          </dl>
          <dl className="param">
            <dt>Accaunt number: </dt>
            <dd> 12345678912345</dd>
          </dl>
          <dl className="param">
            <dt>IBAN: </dt>
            <dd> 123456789</dd>
          </dl>
          <p><strong>Note:</strong> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
        </div>
      )
      return ( this.state.strip_api_loaded && 
        <StripeProvider apiKey={STRIPE_KEY}>
          <main id="site-content" className="room-subscribe whole_list container" role="main">
            <div className="manage-listing-row-container">
              <aside className="col-md-6 bg-primary float-left">
                <div className="container pt-5">
                  {current_room_membership}
                  {other_room_membership}
                  {membership_content}
                  {total_price_list}
                </div>
              </aside>
              <aside className="col-md-6 float-right">
                <article className="card">
                  <div className="card-body p-5">
                    {tab_nav}
                    <div className="tab-content">
                      {tab_pane_stripe}
                      {tab_pane_paypal}
                      {tab_pane_bank}
                    </div>
                  </div>
                </article>
              </aside>
            </div>
          </main>
        </StripeProvider>
      )
    }
  }
}

export default SubscribeRoom;
