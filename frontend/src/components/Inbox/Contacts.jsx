import React from 'react';
import ContactItem from './ContactItem';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faUser, faArchive, faBan, faTrash } from '@fortawesome/free-solid-svg-icons';

class Contacts extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      is_open: true,
      contactStatus: 'active'
    };
    this.searchUserByKey = this.searchUserByKey.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }
  searchUserByKey(e) {
    this.setState({
      keyword: e.target.value
    });
  }
  changeStatus(status) {
    this.setState({
      contactStatus: status
    });
  }
  handleContactClick() {
    this.props.activeContact();
  }
  render() {
    let contact_count = 0;
    this.props.contacts.forEach(contact => {
      if (contact.status === 'active' || contact.status === 'archived') {
        contact_count++;
      }
    });
    return (
      <div className="in-sidebar">
        <ReactTooltip />

        <div className="sidebar-upper">
          <div className="user-avail">
            <div className="user-main">
              <div className="user-avator">
                <img src="https://www.freeiconspng.com/uploads/live-chat-icon-27.png" alt="chat" />
              </div>
              <div className="user-name">
                <p>Inbox</p>
                <span> {contact_count} User{contact_count > 1 ? "s" : ""} to chat with you! </span>
              </div>
            </div>
            <div className="user-info">
              <FontAwesomeIcon icon={faEllipsisH} />
            </div>
          </div>
          <div className="usable-tabs">
            <ul className="list-unstyled">
              <li data-tip="Active" className={this.state.contactStatus === "active" ? "active" : ""} onClick={() => this.changeStatus("active")}>
                <FontAwesomeIcon icon={faUser}/>
              </li>
              <li data-tip="Archived" className={ this.state.contactStatus === "archived" ? "active" : "" } onClick={() => this.changeStatus("archived")}>
                <FontAwesomeIcon icon={faArchive}/>
              </li>
              <li data-tip="Blocked" className={ this.state.contactStatus === "blocked" ? "active" : "" } onClick={() => this.changeStatus("blocked")}>
                <FontAwesomeIcon icon={faBan}/>
              </li>
              <li data-tip="Removed" className={ this.state.contactStatus === "removed" ? "active" : "" } onClick={() => this.changeStatus("removed")}>
                <FontAwesomeIcon icon={faTrash}/>
              </li>
            </ul>
          </div>
          <div className="user-search">
            <div className="search-inner">
              <input type="search" placeholder="Search" value={this.state.keyword} onChange={this.searchUserByKey}/>
            </div>
          </div>
        </div>
        <div className="user-listing">
          <ul className="list-unstyled">
            {this.props.contacts.map((contact, index) => {
              if (
                contact.status === this.state.contactStatus &&
                (contact.full_name
                  .toLowerCase()
                  .includes(this.state.keyword.toLowerCase()) ||
                  contact.email
                    .toLowerCase()
                    .includes(this.state.keyword.toLowerCase()))
              ) {
                return (
                  <ContactItem
                    keyword={this.setState.keyword}
                    key={index}
                    contact={contact}
                    is_open={this.props.is_open}
                    delete={() => this.props.delete(contact.contact_id)}
                    activeContact={() => this.props.activeContact(contact.id)}
                    archive={() => this.props.archive(contact.contact_id)}
                    active={() => this.props.active(contact.contact_id)}
                    block={() => this.props.block(contact.contact_id)}
                    unblock={() => this.props.unblock(contact.contact_id)}
                  />
                );
              }
              return null;
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Contacts;
 