import React from "react";
import { toast } from "react-toastify";
import { dashboardService } from 'services/dashboard';
import { alertService } from 'services/alert';
import 'assets/styles/pages/dashboard/bookingAutomation.scss';

class BAManageRoomId extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page_data: []
    };
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handlePublish = this.handlePublish.bind(this);
  }

  componentDidMount() {
    dashboardService.getRoomList().then(res => {
      if (res) {
        this.setState({
          page_data: res.page_data
        });
      } else {
        alertService.showError('Get Room List');
      }
    });
  }

  handleChangeStatus(list_id, event) {
    event.preventDefault();

    let value = event.target.value;
    let list_index = this.state.page_data.rooms_list.filter(
      list => list.id === list_id
    );
    list_index = this.state.page_data.rooms_list.indexOf(list_index[0]);
    let { page_data } = this.state;

    page_data.rooms_list[list_index].status = value;
    page_data.rooms_list[list_index].published = "unpublished";
    this.setState({
      page_data: page_data
    });
  }

  handlePublish(list_id, event) {
    event.preventDefault();

    let list_index = this.state.page_data.rooms_list.filter(
      list => list.id === list_id
    );
    list_index = this.state.page_data.rooms_list.indexOf(list_index[0]);

    let temp_room = list_index[0];
    let { page_data } = this.state;

    dashboardService.changeRoomState({ list_id, status: temp_room.status }).then(res => {
      if (res.data.status === "success") {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_CENTER
        });
        page_data.rooms_list[list_index].published = "published";
        this.setState({
          page_data: page_data
        });
      } else {
        alertService.showError('Change Room State');
      }
    })
  }

  addBaId(index, e) {
    let { page_data } = this.state;
    dashboardService.getRoomData(page_data.rooms_list[index].id, page_data.rooms_list[index].ba_roomid).then(res => {
      if (res.success === true) {
        alertService.showSuccess(res.message);
        dashboardService.getRoomList().then(res => {
          if (res) {
            this.setState({
              page_data: res.page_data
            });
          } else {
            alertService.showError('Get Room List');
          }
        });
      } else {
        alertService.showError(res.message);
      }
    });
  }

  onChangeInput(index, evt) {
    let { page_data } = this.state;
    page_data.rooms_list[index].ba_roomid = evt.target.value;
  }

  render() {
    let { page_data } = this.state;
    let listed_result_section = [];
    let unlisted_result_section = [];
    if (page_data.rooms_list && page_data.rooms_list.length) {
      page_data.rooms_list.map((list, index) => {
        const room_list = (
          <li key={index}>
            <div className="row" key={index}>
              <div className="col-lg-2 col-md-3">
                <a
                  href={`/homes/${list.address_url}/${list.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="media-cover text-center">
                    <img src={list.featured_image} className="img-responsive" alt="" />
                  </div>
                </a>
              </div>
              <div className="col-lg-10 col-md-9">
                <span className="list-ink">
                  <a
                    href={`/homes/${list.address_url}/${list.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {list.name}
                  </a>
                </span>
                {
                  list.ba_roomid === null || list.ba_roomid === "" ?
                    (
                      <div className="form-group">
                        <div className="form-group">
                          <input
                            name={`${list.id}`}
                            defaultValue=""
                            onChange={e => this.onChangeInput(index, e)}
                            aria-label="Room ID"
                          />
                        </div>
                        <button
                          className="btn btn-info"
                          onClick={e => this.addBaId(index, e)}
                        >
                          Add {list.ba_roomid}
                        </button>
                      </div>
                    ) : (
                      <div className="form-group">
                        <div className="form-group">
                          <input
                            name={`${list.id}`}
                            defaultValue={`${list.ba_roomid}`}
                            disabled
                            aria-label="Room ID"
                          />
                        </div>
                        <span className="alert alert-success">Linked</span>
                      </div>
                    )
                }
              </div>
            </div>
          </li>
        );

        return (listed_result_section.push(room_list));
      });
    }
    return (
      <div className="ba-panel">
        <div className="aside-main-content">
          <div className="side-cnt">
            <div className="head-label">
              <h4>Add Booking Automation room id for each room</h4>
            </div>
            <div className="aside-main-cn">
              <div className="your-listing_">
                <ul className="list-unstyled listing-all">
                  {listed_result_section}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="aside-main-content">
          <div className="head-label">
            <h4>Unlisted</h4>
          </div>
          <div className="aside-main-cn">
            <div className="your-listing_">
              <ul className="list-unstyled listing-all">
                {unlisted_result_section}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BAManageRoomId;
