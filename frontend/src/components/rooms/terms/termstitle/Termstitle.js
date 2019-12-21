import React from "react";

class Termstitle extends React.Component {
  render() {
    return (
      <div className="content_show">
        <div className="content_showhead">
          <h1>Terms</h1>
          <p>
            The requirements and conditions to book a reservation at your
            listing.
          </p>
        </div>
        <div className="content_right">
          <a
            href={`/rooms/manage/${this.props.roomId}/calendar`}
            className="right_save"
          >
            Back
          </a>
          <a
            href={`/rooms/manage/${this.props.roomId}/plans`}
            className="right_save_continue"
          >
            Next
          </a>
        </div>
      </div>
    );
  }
}

export default Termstitle;
