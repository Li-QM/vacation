import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faHeadphonesAlt } from '@fortawesome/free-solid-svg-icons';

class ContactProfile extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  // }
  render() {
    return (
      <div className="in-rightbar">
        <div className="r-user">
          <div className="r-user-in">
            <img src={this.props.contactUser.profile_picture.src} alt="Hi" />
          </div>
        </div>
        <div className="r-user-name">
          <h4>{this.props.contactUser.full_name}</h4>
          <h5>
            {" "}
            {this.props.contactUser.user_type === "host"
              ? "Home Owner"
              : "Traveler"}
          </h5>
        </div>
        <div className="r-user-para">
          <h4>About</h4>
          {
            this.props.contactUser.about !== "" ? (
              <p>{this.props.contactUser.about}</p>
            ) : (
              <p>
                {this.props.contactUser.full_name} does not save his information!
              </p>
            )
          }
        </div>
        <div className="r-user-contact">
          <a href={"mailto:" + this.props.contactUser.email}>
            <FontAwesomeIcon icon={faEnvelope}/>
            {this.props.contactUser.email}
          </a>
          <a href={"tel:" + this.props.contactUser.primary_phone_number}>
            <FontAwesomeIcon icon={faHeadphonesAlt}/>
            {" "}
            {this.props.contactUser.primary_phone_number}
          </a>
        </div>
      </div>
    );
  }
}
export default ContactProfile;
