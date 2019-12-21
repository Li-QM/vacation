import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faFile, faMap, faFileImage, faVideo, faGraduationCap, faPlus, faCheck} from '@fortawesome/free-solid-svg-icons';
import {roomsService} from 'services/rooms';

import "assets/styles/rooms/sidebar.scss";

class RoomsSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page_data: {},
      room_step: this.props.room_step,
      rooms_step_status: {}
    };
    this.activeMenu = this.activeMenu.bind(this);
  }
  componentDidMount() {
    roomsService.getRoomsStepStatus(this.props.room_id).then(res => {
      if (res) {
        this.setState({rooms_step_status: res});
      }
    });
  }

  onUpdateState() {
    roomsService.getRoomsStepStatus(this.props.room_id).then(res => {
      if (res) {
        this.setState({rooms_step_status: res});
      }
    });
  }

  // componentDidUpdate(nextprops) {
  //   roomsService.getRoomsStepStatus(this.props.room_id).then(res => {
  //     this.setState({rooms_step_status: res});
  //   });
  // }

  activeMenu(room_step) {
    this.setState({
      room_step: room_step
    });
  }

  render() {
    let completed_steps = 0;
    if(this.state.rooms_step_status.basics === '1') completed_steps++;
    if(this.state.rooms_step_status.calendar === '1') completed_steps++;
    if(this.state.rooms_step_status.description === '1') completed_steps++;
    if(this.state.rooms_step_status.location === '1') completed_steps++;
    if(this.state.rooms_step_status.photos === '1') completed_steps++;
    if(this.state.rooms_step_status.plans === '1') completed_steps++;
    if(this.state.rooms_step_status.pricing === '1') completed_steps++;
    if(this.state.rooms_step_status.terms === '1') completed_steps++;

    const { room_step } = this.state;
    const sub_menus = [
      {room_step: 'basics',       title: 'Basics',      icon: faDatabase, status: this.state.rooms_step_status.basics},
      {room_step: 'description',  title: 'Description', icon: faFile,     status: this.state.rooms_step_status.description},
      {room_step: 'location',     title: 'Location',    icon: faMap,      status: this.state.rooms_step_status.location},
      {room_step: 'amenities',    title: 'Amenities',   icon: faGraduationCap, status: 'none'},
      {room_step: 'photos',       title: 'Photos',      icon: faFileImage, status: this.state.rooms_step_status.photos},
      {room_step: 'video',        title: 'Video',       icon: faVideo,    status: 'none'},
      {room_step: 'pricing',      title: 'Pricing',     icon: faDatabase, status: this.state.rooms_step_status.pricing},
      {room_step: 'calendar',     title: 'Calendar',    icon: faFile,     status: this.state.rooms_step_status.calendar},
      {room_step: 'terms',        title: 'Terms',       icon: faMap,      status: this.state.rooms_step_status.terms},
      {room_step: 'plans',        title: 'Publish',     icon: faGraduationCap, status: this.state.rooms_step_status.plans}
    ]

    return (
      <div className="listing-nav-sm nopad">
        <div className="nav-sections height_adj">
          <ul className="list-unstyled margin-bot-5 list-nav-link">
            {
              sub_menus.map( (sub_menu, index) => {
                return (
                  <li key={index} id={sub_menu.room_step} className={room_step === sub_menu.room_step ? "nav-item pre-listed nav-active" : "nav-item pre-listed"}>
                    <Link to={`${this.props.base_url}/${sub_menu.room_step}`} onClick={() => this.activeMenu(sub_menu.room_step)}>
                      <div className="d-flex nav-item pr-10">
                        <div className="icon my-auto">
                          <FontAwesomeIcon icon={sub_menu.icon}/>
                        </div>
                        <span className="va-middle">{sub_menu.title}</span>
                        {
                          sub_menu.status !== "none" &&
                          <div className={sub_menu.status === "1" ? "d-none" : "ml-auto my-auto"}>
                            <FontAwesomeIcon icon={faPlus}/>
                          </div>
                        }
                        {
                          sub_menu.status !== "none" &&
                          <div className={sub_menu.status === "1" ? "ml-auto my-auto" : "d-none"}>
                            <FontAwesomeIcon icon={faCheck} className="text-success"/>
                          </div>
                        }
                      </div>
                    </Link>
                  </li>
                )
              })
            }
          </ul>
        </div>

        <div className="publish-actions text-center">
          <div id="user-suspended" />
          <div id="availability-dropdown">
            <i className="dot mb-10 dot-danger" />
            &nbsp;
            <div className="select">
              <select className="room_status_dropdown" disabled>
                <option value="Listed">Listed</option>
                <option value="Unlisted">Unlisted</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
          <div id="js-publish-button" className="mt-2">
            <div className="not-post-listed text-center">
              <div className="animated text-lead text-muted steps-remaining js-steps-remaining show" style={{ opacity: 1 }}>
                {
                  completed_steps === 8 ? 
                  <div>You completed all steps</div> 
                  : 
                  <div> Complete <strong className="text-highlight"><span id="steps_count"> {8-completed_steps}</span> steps</strong>{" "} to list your space.</div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RoomsSidebar;
