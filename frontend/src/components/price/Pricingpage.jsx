import React from "react";
// import './pricingtable.css'
import { roomsService } from "services/rooms";
import { alertService } from "services/alert";
import PricingList from "./PricingList";

class Pricingpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      types: [],
      current_plan: ""
    };
  }
  componentDidMount() {
    roomsService.getMembershipTypes().then(res => {
      if (res) {
        this.setState({
          types: res.data,
          current_plan: res.current_plan
        });
      } else {
        alertService.showError("Get membership");
      }
    });
  }
  render() {
    const static_data = [
      {
        title: "Availability calendar",
        attribute: "is_availability_calendar"
      },
      {
        title: "Ranks above Bronze in search results",
        attribute: "rank_above_bronze_in_search"
      },
      {
        title: "Ranks above Silver in search results",
        attribute: "rnak_above_sliver_in_search"
      },
      {
        title: "More inquiries than Bronze",
        attribute: "average_inquiries_than_basic"
      },
      {
        title: "Link to your personal website",
        attribute: "link_personal_website"
      },
      {
        title: "Phone number published",
        attribute: "phone_number_published"
      },
      {
        title: "Free special offers",
        attribute: "free_special_offers"
      },
      {
        title: "Text message (SMS) inquiry alerts",
        attribute: "sms_inquiry_alerts"
      },
      {
        title: "Free custom video",
        attribute: "free_custom_video"
      },
      {
        title: "Ranks highest in search results",
        attribute: "rank_highest_in_search"
      },
      {
        title: "Featured on home page",
        attribute: "featured_on_home_page"
      }
    ];
    return (
      <div className="container comparison mb-4">
        <table>
          <thead>
            <tr>
              <th className="tl"></th>
              {this.state.types.map((type, index) => {
                return (
                  <th className="compare-heading" key={index}>
                    {type.Name}
                  </th>
                );
              })}
            </tr>
            <tr>
              <th className="" key={0}>
                <h3>Listing Features </h3>
              </th>
              {
                this.state.types.map((type, index) => {
                  return (
                    <th className="price-info" key={index + 1}>
                      <div className="price-now" key={index + 1}>
                        <span>${type.annual_fee} </span> /year
                      </div>
                    </th>
                  );
                })
              }
            </tr>
          </thead>
          <tbody>
            {static_data.map((elem, index) => {
              return (
                <>
                  <tr>
                    <td />
                    <td colSpan={4}>{elem.title}</td>
                  </tr>
                  <PricingList title={elem.title}
                    attribute={elem.attribute}
                    types={this.state.types}
                    key={index}
                  />
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Pricingpage;
