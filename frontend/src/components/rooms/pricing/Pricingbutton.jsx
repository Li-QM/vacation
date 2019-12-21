import React from "react";

class Pricingbutton extends React.Component {
  render() {
    return (
      <div className="calendar_savebuttons col-sm-12">
        <a
          href={`/rooms/manage/${this.props.room_id}/video`}
          className="right_save"
        >
          Back
        </a>
        <a
          href={`/rooms/manage/${this.props.room_id}/calendar`}
          className="right_save_continue"
        >
          Next
        </a>
      </div>
    );
  }
}

export default Pricingbutton;
