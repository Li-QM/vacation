import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faCommentAlt, 
  faSun, 
  faList, 
  faSuitcase, 
  faUser, 
  faKey, 
  faAngleRight 
} from '@fortawesome/free-solid-svg-icons';
import DashboardRouter from './DashboardRouter';

import 'assets/styles/pages/dashboard/dashboard.scss';
import 'assets/styles/pages/dashboard/breadcrumb.scss';

const menuItems = [
  { url: "/dashboard", icon: faSun, text: "Dashboard", is_sub_menu: false },
  {
    url: "/dashboard", icon: faList, text: "Listing", is_sub_menu: true, sub_menu: [
      { url: "/dashboard/room-listing", text: "Your Listing", is_sub_menu: false },
      { url: "/dashboard/reservation", text: "Your Reservation", is_sub_menu: false }]
  },
  {
    url: "/dashboard", icon: faSuitcase, text: "Trips", is_sub_menu: true, sub_menu: [
      { url: "/dashboard/mytrips", text: "Your Trips", is_sub_menu: false },
      { url: "/dashboard/oldtrips", text: "Your Previous Trips", is_sub_menu: false }]
  },
  {
    url: "/dashboard", icon: faUser, text: "Profile", is_sub_menu: true, sub_menu: [
      { url: "/dashboard/myprofile", text: "Edit Profile", is_sub_menu: false },
      { url: "/dashboard/photo", text: "Photo", is_sub_menu: false },
      { url: "/dashboard/edit_verification", text: "Verification", is_sub_menu: false },
      { url: "/dashboard/account_ba", text: "Booking Automation Account", is_sub_menu: false }]
  },
  { url: "/dashboard/myaccount", icon: faSun, text: "Account", is_sub_menu: false },
  {
    url: "/dashboard/account_ba", icon: faUser, text: "Booking Automation", is_sub_menu: true, sub_menu: [
      { url: "/dashboard/account_ba", text: "Manage api keys", is_sub_menu: false },
      { url: "/dashboard/ba_manage_roomid", text: "Manage room ids", is_sub_menu: false },
      { url: "/dashboard/ba_update", text: "Update page", is_sub_menu: false }]
  },
  { url: "/dashboard/api_key", icon: faKey, text: "API Key", is_sub_menu: false }
];

const handleMenuClick = (event, index) => {
  for (const menuItem of menuItems) {
    if (menuItems[index] !== menuItem) {
      menuItem.active = false;
    }
  }

  menuItems[index].active = menuItems[index].active ? false : true;
}

function Dashboard({ match }) {
  return (
    <main className="dashboard-main">

      {/* Head Wrap Bar */}
      <div className="breadcrumb-container">
        <div className="container">
          <div className="head-wrap">
            <div className="breadcrumb">
              <div className="breadcrumb-item">
                <FontAwesomeIcon icon={faHome} />
              </div>
              <div className="breadcrumb-item active">/</div>
              <div className="breadcrumb-item active" aria-current="page">
                Dashboard
              </div>
            </div>

            <div className="head-inbox">
              <Link to="/inbox" className="btn btn-outline-light">
                Inbox
                <FontAwesomeIcon className="before-space" icon={faCommentAlt} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Head Wrap Bar */}

      {/* Dashboard Content */}
      <div className="dashboard">
        <div className="container">
          <div className="row">
            {/* Dashboard List */}
            <div className="col-md-3">
              <div className="sidebar">
                <div className="list-group">
                  <ul>
                    {menuItems.map((menuItem, index) => {
                      return (
                        <li key={index} className={menuItem.active === true ? "open-sub" : "parent-drop"}>
                          {menuItem.is_sub_menu ?
                            (<Link to="#" className="list-group-item list-group-item-action" onClick={event => handleMenuClick(event, index)}>
                              <FontAwesomeIcon className="after-space-15" icon={menuItem.icon} />
                              {menuItem.text}{" "}
                              {menuItem.is_sub_menu ? (<FontAwesomeIcon className="fa-angle-right" icon={faAngleRight} />) : null}
                            </Link>) :
                            (<Link to={menuItem.url} className="list-group-item list-group-item-action">
                              <FontAwesomeIcon className="after-space-15" icon={menuItem.icon} />
                              {menuItem.text} {" "}
                              {menuItem.is_sub_menu ? (<FontAwesomeIcon className="fa-angle-right" icon={faAngleRight} />) : null}
                            </Link>
                            )}

                          {menuItem.is_sub_menu && (
                            <ul className={`sub-menus ${menuItem.active === true ? "active" : ""}`}>
                              {menuItem.sub_menu.map((sub_menu, sub_index) => {
                                return (
                                  <li key={sub_index}>
                                    <Link to={sub_menu.url}>{sub_menu.text}</Link>
                                  </li>
                                );
                              }
                              )}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            {/* Dashboard List */}

            {/* Dashboard Content */}
            <div className="col-md-9">
              <DashboardRouter match = {match}/>
            </div>
            {/* Dashboard Content */}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;