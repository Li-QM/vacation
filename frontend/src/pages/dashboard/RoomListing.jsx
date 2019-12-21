import React from 'react';
import { Link } from 'react-router-dom';

import { dashboardService } from 'services/dashboard';
import { alertService } from 'services/alert';

import 'assets/styles/pages/dashboard/rooms.scss';
import 'assets/styles/pages/dashboard/dashboard.scss';

const RoomItem = ((list_data, index, handleChangeStatus, handlePublish) => {
  return (
    <li key={index}>
      <div className="row">
        <div className="col-lg-2 col-md-3">
          <Link to={`/homes/${list_data.address_url}/${list_data.id}`} target="_blank">
            <div className="media-cover text-center">
              <img src={list_data.featured_image} className="img-responsive" alt="" />
            </div>
          </Link>
        </div>
        <div className="col-lg-7 col-md-5">
          <span className="list-ink">
            <Link to={`/homes/${list_data.address_url}/${list_data.id}`} target="_blank">
              {list_data.name}
            </Link>
          </span>
          <div className="actions">
            <Link className="listing-link-space" to={`/rooms/manage/${list_data.id}/basics`} target="_blank">
              Manage Listing and Calendar
            </Link>
          </div>
        </div>
        <div className="col-lg-3 col-md-4 text-right">
          <div className="listing-criteria-header">
            <div className="hide-sm show-md show-lg">
              <div className="field-wrapper">
                {list_data.has_subscription === true &&
                  <select
                    name="State"
                    placeholder="State"
                    className="form-in"
                    data-room-id={list_data.id}
                    value={list_data.status}
                    onChange={(event) => handleChangeStatus(list_data.id, event)}
                  >
                    <option value="Listed" defaultValue="selected">Listed</option>
                    <option value="Unlisted">Unlisted</option>
                    <option value="Draft">Draft</option>
                  </select>}
              </div>
            </div>
            {/* { list_data.has_subscription === false  ? <a className="list-noti btn btn-primary text-white" href={`/rooms/${list_data.id}/subscribe_property`} rel="noopener noreferrer" target='_blank'>Subscribe</a> : <span className="list-noti">Subscribed</span>  }
            { list_data.published !== 'unpublished' ? '' : <Link to="#" data-id={list_data.id} className="list-noti ml-1" onClick={(event)=>handlePublish(list_data.id, event)}> | Save Status</Link>} */}
          </div>
        </div>
      </div>
    </li>
  )
})

class RoomListing extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      page_data: null
    };

    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handlePublish = this.handlePublish.bind(this);
  }

  componentDidMount() {
    dashboardService.getRoomList().then(res => {
      if (res) {
        this.setState({
          page_data: res.page_data
        })
      } else {
        alertService.showError('Get Room List');
      }
    });
  }

  handleChangeStatus(list_id, event) {
    event.preventDefault();
    let value = event.target.value;
    let list_index = this.state.page_data.rooms_list.filter((list) => list.id === list_id);
    list_index = this.state.page_data.rooms_list.indexOf(list_index[0]);
    let { page_data } = this.state;
    page_data.rooms_list[list_index].status = value;
    page_data.rooms_list[list_index].published = 'unpublished';
    this.setState({
      page_data: page_data
    });
  }

  handlePublish(list_id, event) {
    event.preventDefault();
    let list_index = this.state.page_data.rooms_list.filter((list) => list.id === list_id);
    let temp_room = list_index[0];
    list_index = this.state.page_data.rooms_list.indexOf(list_index[0]);
    let { page_data } = this.state;
    
    // page_data.rooms_list[list_index].status = value
    let req = {
      room_id: list_id,
      status: temp_room.status
    }
    dashboardService.changeRoomState(req).then(res => {
      if (res && res.status === 'success') {
        alertService.showSuccess(res.message, '');
        page_data.rooms_list[list_index].published = 'published';
        this.setState({
          page_data: page_data
        });
      } else {
        alertService.showError('Update room status', 'Error!!!');
      };
    });
  }

  render() {
    // Get Listed Items
    let listed_result_section = this.state.page_data && this.state.page_data.rooms_list.map((list_data, index) => {
      if (list_data.status !== "Listed") return null;
      return (
        RoomItem(list_data, index, this.handleChangeStatus, this.handlePublish)
      )
    })

    // Get Unlisted Items
    let unlisted_result_section = this.state.page_data && this.state.page_data.rooms_list.map((list_data, index) => {
      if (list_data.status === "Listed") return null;
      return (
        RoomItem(list_data, index, this.handleChangeStatus, this.handlePublish)
      )
    })

    // Rendering
    return (
      <div>
        {/* Listed */}
        <div className="aside-main-content">
          <div className="head-label">
            <h4>Listed</h4>
          </div>

          <div className="aside-main-cn">
            <div className="your-listing">
              <ul className="list-unstyled listing-all">
                {
                  listed_result_section
                }
              </ul>
            </div>
          </div>
        </div>
        {/* Listed */}

        {/* UnListed */}
        <div className="aside-main-content">
          <div className="head-label">
            <h4>Unlisted</h4>
          </div>
          <div className="aside-main-cn">
            <div className="your-listing">
              <ul className="list-unstyled listing-all">
                {
                  unlisted_result_section
                }
              </ul>
            </div>
          </div>
        </div>
        {/* UnListed */}
      </div>
    )
  }
}

export default RoomListing;