import React from "react";

class Termsbutton extends React.Component {
  render() {
    return (
      <div className="calendar_savebuttons">
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
    );
  }
}

export default Termsbutton;
