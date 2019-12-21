import React from 'react';

class ManageRoomFooter extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const {room_id, prev, next} = this.props;

    return (
      <div className="content_right">
        {prev && <a href={`/rooms/manage/${room_id}/${prev}`} className="right_save">Back</a>}
        {next && <a href={`/rooms/manage/${room_id}/${next}`} className="right_save_continue" >Next</a>}
      </div>
    );
  }
}

export default ManageRoomFooter;