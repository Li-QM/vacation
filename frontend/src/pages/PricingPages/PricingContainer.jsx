import React from 'react';
import 'assets/styles/pages/pricing/pricingtable.scss';
import { roomsService } from 'services/rooms';
import { alertService } from 'services/alert';

const priceTable = [
  { title: 'Availability calendar', attribute: 'is_availability_calendar'},
  { title: 'Ranks above Bronze in search results', attribute: 'rank_above_bronze_in_search'},
  { title: 'Ranks above Silver in search results', attribute: 'rank_above_sliver_in_search'},
  // { title: 'Ranks above Basic in search results', attribute: 'rank_above_basic_in_search'},
  { title: 'More inquiries than Bronze', attribute: 'average_inquiries_than_basic'},
  { title: 'Link to your personal website', attribute: 'link_personal_website'},
  { title: 'Phone number published', attribute: 'phone_number_published'},
  { title: 'Free special offers', attribute: 'free_special_offers'},
  { title: 'Text message (SMS) inquiry alerts', attribute: 'sms_inquiry_alerts'},
  { title: 'Free custom video', attribute: 'free_custom_video'},
  { title: 'Ranks highest in search results', attribute: 'rank_highest_in_search'},
  { title: 'Featured on home page', attribute: 'featured_on_home_page'}
]

class PricingContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      types: [],
      current_plan: ''
    }
  }
  componentDidMount () {
    roomsService.getMembershipTypes().then(res => {
      if(res) {
        this.setState({
          types: res.data,
          current_plan: res.current_plan
        });
      } else {
        alertService.showError('Get Membership');
      }
    });
  }
  render() {
    return (
      <div>
        <div className="container comparison mb-4">
          <table>
            <thead>
              <tr style={{borderTop : 'solid 1px gray'}}>
                <th className="tl"></th>
                {
                  this.state.types.map((type, index) => {
                    return (<th className="compare-heading" key={index}> {type.Name} </th>);
                  })
                }
              </tr>
              <tr>
                <th className=""><h3>Listing Features	</h3></th>
                {
                  this.state.types.map((type, index) => {
                    return (
                      <th className="price-info" key={index}>
                         <div className="price-now"> <span>${type.annual_fee} </span> /year</div>
                      </th>
                    )
                  })
                }
              </tr>
            </thead>
            <tbody>
              {
                priceTable && priceTable.length > 0 && priceTable.map((item, index) => {
                  return (
                    <tr className="compare-row" key={index}>
                      <td>{item.title}</td>
                      {
                        this.state.types.map((type, index) => {
                          return (<td key={index}><span className="tickblue" key={index}>{type[item.attribute] ? '✔' : '-'}</span></td>);
                        })
                      }
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default PricingContainer;