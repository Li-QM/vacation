import React from "react";

class ContactItem extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  // }
  render() {
    return (
      <li className="main-con-list" onClick={this.props.openChat}>
        <div className="con-list-left">
          <div className="list-img">
            <img src={this.props.contact.profile_picture.src} alt="Hi"/>
          </div>
        </div>
        <div className="con-list-right">
          <div className="con-list-meta">
            <div className="con-list-body-author">
              {" "}
              <strong> {this.props.contact.full_name}</strong>
            </div>
            <div className="con-list-body-timestamp">
              {this.props.contact.live}
            </div>
          </div>
          <div className="con-list-content">
            <div className="con-list-in">
              <span className="con-list-in-l">Email:</span>
              <div className="con-listi-in-r"> {this.props.contact.email}</div>
            </div>
            <div className="con-list-in">
              <span className="con-list-in-l">Phone:</span>
              <div className="con-listi-in-r">
                {" "}
                {this.props.contact.primary_phone_number}
              </div>
            </div>
          </div>
        </div>
      </li>
    );
    // return (
    //   <li className="list-group-item cs-list-users offline">
    //     <Link to="#" className="float-left" onClick={this.props.openChat}>
    //       <span className="image">
    //         <img src={this.props.contact.profile_picture.src} width="32px" alt="contact profile"/>
    //       </span>
    //       <span className="xwb-display-name">
    //         {this.props.contact.full_name}
    //       </span>

    //       {/* <p className='text-truncate'> {this.props.contact.email}</p>  */}
    //     </Link>
    //     <div className="dropdown float-right">
    //       <Link to="#" className="dropdown-toggle" data-toggle="dropdown">
    //         <i className="fa fa-ellipsis-h"></i>
    //       </Link>
    //       <div className="dropdown-menu">
    //         <Link
    //           to="#"
    //           className="dropdown-item"
    //           onClick={
    //             this.props.contact.status === "active"
    //               ? this.props.archive
    //               : this.props.active
    //           }
    //         >
    //           {this.props.contact.status === "active" ? "Archive" : "Active"}
    //         </Link>
    //         {this.props.contact.status !== "blocked" ? (
    //           <Link className="dropdown-item" to="#" onClick={this.props.block}>
    //             Block
    //           </Link>
    //         ) : null}
    //         {this.props.contact.status === "blocked" ? (
    //           <Link
    //             className="dropdown-item"
    //             to="#"
    //             onClick={this.props.unblock}
    //           >
    //             UnBlock
    //           </Link>
    //         ) : null}
    //         <Link className="dropdown-item" to="#" onClick={this.props.delete}>
    //           Delete
    //         </Link>
    //         {/* <a className="dropdown-item" onClick={this.props}>Link 3</a> */}
    //       </div>
    //     </div>
    //   </li>
    // );
  }
}
export default ContactItem;
