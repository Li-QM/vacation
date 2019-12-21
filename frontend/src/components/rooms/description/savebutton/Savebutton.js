import React from "react";

class Savebutton extends React.Component {
  render() {
    return (
      <div className="calendar_savebuttons col-sm-12">
        <a
          href={`/rooms/manage/${this.props.roomId}/basics`}
          className="right_save"
        >
          Back
        </a>
        <a
          href={`/rooms/manage/${this.props.roomId}/location`}
          className="right_save_continue"
        >
          Next
        </a>
      </div>
    );
  }
}

export default Savebutton;
