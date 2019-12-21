import React from 'react';

import Pricingtitle from 'components/rooms/pricing/Pricingtitle';
import Currency from 'components/rooms/pricing/Currency';
import Nightly from 'components/rooms/pricing/Nightly';
import Monthly from 'components/rooms/pricing/Monthly';
import Weekend from 'components/rooms/pricing/Weekend';
import Minnights from 'components/rooms/pricing/Minnights';
import Cleanfee from 'components/rooms/pricing/Cleanfee';
import Additionalcharge from 'components/rooms/pricing/Additionalcharge';
import Tax from 'components/rooms/pricing/Tax';
import Refundable from 'components/rooms/pricing/Refundable';
import Occupancy from 'components/rooms/pricing/Occupancy';
import Mindiscount from 'components/rooms/pricing/Mindiscount';
import Editprice from 'components/rooms/pricing/Editprice';
import Seasonalbutton from 'components/rooms/pricing/Seasonalbutton';
import Pricingbutton from 'components/rooms/pricing/Pricingbutton';
import { roomsService } from 'services/rooms';
import { alertService } from 'services/alert';

import property_help from 'assets/images/property-help.png';
import 'assets/styles/rooms/room_pricing.scss';

class RoomPricing extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      page_data: {}
    };
    this.currencyChange = this.currencyChange.bind(this);
    this.nightChange = this.nightChange.bind(this);
    this.monthlyChange = this.monthlyChange.bind(this);
    this.mininightChange = this.mininightChange.bind(this);
    this.cleaningChange = this.cleaningChange.bind(this);
    this.weekendChange = this.weekendChange.bind(this);
    this.handleChangeRoomsPrice = this.handleChangeRoomsPrice.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
  }
  componentDidMount() {
    const room_id = this.props.match.params.room_id;
    roomsService.getBasicsData(room_id).then(res => {
      if (res) {
        this.setState({page_data: res});
        this.props.onUpdateSidebar();
      } else {
        alertService.showError('Get room content');
      }
    });
  }
  cleaningChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    const page_data = this.state.page_data;

    page_data.rooms_price[name] = value;
    this.setState({
      page_data: page_data
    });

    const data = {
      currency_code: this.state.page_data.rooms_price.currency_code,
      [name]: value
    }
    if (value !== '') this.updatePrice(page_data, data);
  }
  mininightChange(e) {
    const value = e.target.value;
    const page_data = this.state.page_data;
    page_data.rooms_price.minimum_stay = value;
    this.setState({
      page_data: page_data
    });

    const data = {
      currency_code: this.state.page_data.rooms_price.currency_code,
      minimum_stay: value
    }
    if (value !== '') this.updatePrice(page_data, data);
  }
  weekendChange(e) {
    const value = e.target.value;
    const page_data = this.state.page_data;
    page_data.rooms_price.weekend = value;
    page_data.rooms_price.original_weekend = value;
    this.setState({
      page_data: page_data
    });

    const data = {
      currency_code: this.state.page_data.rooms_price.currency_code,
      weekend: value
    }
    if (value !== '') this.updatePrice(page_data, data);
  }
  nightChange(e) {
    const value = e.target.value;
    const page_data = this.state.page_data;
    page_data.rooms_price.night = value;
    page_data.rooms_price.original_night = value;
    this.setState({
      page_data: page_data
    });

    const data = {
      currency_code: this.state.page_data.rooms_price.currency_code,
      night: value
    }
    if (value !== '') this.updatePrice(page_data, data);
  }

  handleChangeRoomsPrice(e) {
    e.preventDefault();

    const value = e.target.value;
    const name = e.target.name;
    const page_data = this.state.page_data;
    page_data.rooms_price[name] = value;
    this.setState({
      page_data: page_data
    });

    const data = {
      currency_code: this.state.page_data.rooms_price.currency_code,
      [name]: value
    }
    if (value !== '') this.updatePrice(page_data, data);
  }
  monthlyChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    const page_data = this.state.page_data;
    page_data.rooms_price[name] = value;
    page_data.rooms_price['original_' + name] = value;
    // original_week
    this.setState({
      page_data: page_data
    });

    const data = {
      currency_code: this.state.page_data.rooms_price.currency_code,
      [name]: value
    }
    if (value !== '') this.updatePrice(page_data, data);
  }
  currencyChange(e) {
    const value = e.target.value;
    const page_data = this.state.page_data;
    page_data.rooms_price.currency_code = value;

    const data = {
      currency_code: value,
      night: this.state.page_data.rooms_price.night
    }
    if (value !== '') this.updatePrice(page_data, data);
  }
  
  updatePrice(page_data, data) {
    const room_id = this.props.match.params.room_id;
    roomsService.updatePrice(room_id, data).then(res => {
      if (res) {
        if (res.success === 'true') {
          this.setState({page_data: page_data});
          this.props.onUpdateSidebar();
        } else {
          // if (res.attribute) alertService.showError(res.attribute, res.msg);
        }
      } else {
        // Nothing to do
        // alertService.showError('Update price');
      }
    });
  }

  handleRoomChange(e) {
    e.preventDefault();

    const page_data = this.state.page_data;
    page_data.result.accommodates = e.target.value;
    this.setState({
      page_data: page_data
    });

    const room_id = this.props.match.params.room_id;
    const req = {
      current_tab: this.state.current_lang,
      data: JSON.stringify({ accommodates: e.target.value })
    }
    roomsService.updateRooms(room_id, req).then(res => {
      if (res) {
        alertService.showSuccess('Saved !');
        this.props.onUpdateSidebar();
      } else {
        alertService.showError('Saved !');
      }
    });
  }
  render() {
    return (
      <div className="manage-listing-content-wrapper room-pricing">
        <div className="listing_whole col-md-9" id="js-manage-listing-content">
          <div className="common_listpage">
            <Pricingtitle room_id={this.props.match.params.room_id} />
            <Currency
              code={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.currency_code
                  : 'USD'
              }
              onChange={this.currencyChange}
              data={
                this.state.page_data.currencies
                  ? this.state.page_data.currencies
                  : []
              }
              value={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.currency_code
                  : ''
              }
            />
            <Nightly
              code={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.currency_code
                  : 'USD'
              }
              value={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.original_night
                  : 0
              }
              onChange={this.nightChange}
            />
            <Monthly
              code={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.currency_code
                  : 'USD'
              }
              onChange={this.monthlyChange}
              week_value={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.original_week
                  : 0
              }
              month_value={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.original_month
                  : 0
              }
            />
            <Weekend
              code={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.currency_code
                  : 'USD'
              }
              onChange={this.weekendChange}
              value={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.original_weekend
                  : 0
              }
            />
            <Minnights
              value={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.minimum_stay
                  : 1
              }
              onChange={this.mininightChange}
            />
            <h2 className="h-two-raja">Additional Charges:</h2>
            <Cleanfee
              code={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.currency_code
                  : 'USD'
              }
              type_value={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.cleaning_fee_type
                  : 0
              }
              fee_value={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.cleaning
                  : 0
              }
              cleaning_taxable={
                this.state.page_data.rooms_price && this.state.page_data.rooms_price.cleaning_taxable
                  ? this.state.page_data.rooms_price.cleaning_taxable
                  : 'no'
              }
              onChange={this.cleaningChange}
            />
            <Additionalcharge
              code={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.currency_code
                  : 'USD'
              }
              room_id={this.props.match.params.room_id}
              data={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.additional_charge
                  : '[]'
              }
            />
            <Tax
              value={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.tax
                  : ''
              }
              onChange={this.handleChangeRoomsPrice}
            />
            <Refundable
              code={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.currency_code
                  : 'USD'
              }
              value={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.security
                  : ''
              }
              onChange={this.handleChangeRoomsPrice}
            />
            <Occupancy
              handleRoomChange={this.handleRoomChange}
              code={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.currency_code
                  : 'USD'
              }
              max_guests={
                this.state.page_data.result
                  ? this.state.page_data.result.accommodates
                  : 0
              }
              guests={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.guests
                  : 0
              }
              additional_guest={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.additional_guest
                  : 0
              }
              onChange={this.handleChangeRoomsPrice}
            />
            <h2 className="h-two-raja">Last min discounts</h2>
            <Mindiscount room_id={this.props.match.params.room_id} onUpdateSidebar={this.props.onUpdateSidebar}/>
            <Editprice
              code={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price.currency_code
                  : 'USD'
              }
              data={
                this.state.page_data.rooms_price
                  ? this.state.page_data.rooms_price
                  : {}
              }
            />
            <Seasonalbutton />
            <Pricingbutton room_id={this.props.match.params.room_id} />
          </div>
        </div>
        <div className="col-md-3 col-sm-12 listing_desc">
          <div className="manage_listing_left">
            <img
              src={property_help}
              alt="property-help"
              className="col-center"
              width="75"
              height="75"
            />
            <div className="amenities_about">
              <h4>Charges per night</h4>
              <p>
                You may want attract your first few guests by offering a great
                deal. You can always increase your price after you’ve received
                some great reviews.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RoomPricing;
