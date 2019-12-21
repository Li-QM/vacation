import React from "react";
// import Axios from 'axios';
import Accordion from "../components/Accordion";
import AmenitiesInfo from "../components/AmenitiesInfo";
import Amenities from "../components/Amenities";
import Description from "../components/Description";
import HouseRule from "../components/Description";
import SeasonalRateCalendar from "../components/SeasonalRateCalendar";

import 'assets/styles/pages/homes/summaryExtend.scss';

import { listingDetailService } from 'services/listingDetail';

class SummaryExtend extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bathrooms: [],
      house_type: {},
      rooms_description: {}
    };
  }
  componentDidMount() {
    listingDetailService.getHouseType(this.props.room_id).then(res => {
      if (res) {
          this.setState({
          house_type: res.house_type
        });
      }
    });

    listingDetailService.getAmenityType(this.props.room_id).then(res => {
      if (res) {
        this.setState({
          amenities: res.amenities,
          amenities_icon: res.amenities_icon,
          amenities_type: res.amenities_type,
          safety_amenities: res.safety_amenities
        });
      }
    });

    listingDetailService.getHomeDescription(this.props.room_id).then(res => {
      if (res) {
        this.setState({
          rooms_description: res.rooms_description
        });
      }
    });
  }
  render() {
    let accordion_list = [
      {
        title: "The Space",
        content: (
          <AmenitiesInfo
            bathrooms={this.state.bathrooms ? this.state.bathrooms : []}
            bedrooms={this.state.bedrooms ? this.state.bedrooms : []}
            room_detail={this.props.room_detail}
          />
        )
      },
      {
        title: "Amenities",
        content: (
          <Amenities
            amenities_type={this.state.amenities_type}
            amenities={this.state.amenities}
            amenities_icon={this.state.amenities_icon}
          />
        )
      },
      {
        title: "Description",
        content: (
          <Description rooms_description={this.state.rooms_description} />
        )
      },
      {
        title: "House Rules",
        content: (
          <HouseRule
            rooms_description={{
              house_rule: this.state.rooms_description
                ? this.state.rooms_description.house_rules
                : ""
            }}
          />
        )
      },
      {
        title: "Availability & Pricing",
        content: <SeasonalRateCalendar room_id={this.props.room_id} />
      }
    ];
    return (
      <div id="summary-extend">
        <div
          id="details-column"
          className="col-lg-12 lang-chang-label col-sm-12 p-0"
        >
          <h4 className="row-space-4 text-center-sm">About this listing</h4>
          <div className="row row-condensed text-muted text-center">
            <div className="col-md-3 col-sm-3 col-xs-3 roomty">
              <i className="icon icon-entire-place icon-size-2" />
              <div className="numfel">
                {this.state.house_type ? this.state.house_type.name : "Nan"}
              </div>
            </div>
            <div className="col-md-3 col-sm-3 col-xs-3 roomty">
              <i className="icon icon-group icon-size-2" />
              <div className="numfel">
                {this.props.room_detail
                  ? this.props.room_detail.accommodates
                  : 0}{" "}
                Guests
              </div>
            </div>
            <div className="col-md-3 col-sm-3 col-xs-3 roomty">
              <i className="icon icon-double-bed icon-size-2" />
              <div className="numfel">
                {this.props.room_detail ? this.props.room_detail.bedrooms : 0}{" "}
                Bedrooms
              </div>
            </div>
            <div className="col-md-3 col-sm-3 col-xs-3 roomty">
              <i className="icon icon icon-bathtub icon-size-2" />
              <div className="numfel">
                {" "}
                {this.props.room_detail
                  ? this.props.room_detail.bathrooms
                  : 0}{" "}
                Bathrooms
              </div>
            </div>
          </div>
          <hr />
          <div
            className="summary_content description-container"
            dangerouslySetInnerHTML={{
              __html: this.props.room_detail
                ? this.props.room_detail.summary
                : ""
            }}
          ></div>
          <Accordion data={accordion_list} />
          <hr />
        </div>
      </div>
    );
  }
}

export default SummaryExtend;
