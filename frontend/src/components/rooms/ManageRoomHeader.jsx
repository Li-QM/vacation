import React from 'react';

class ManageRoomHeader extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const {title, descr, room_id, prev, next} = this.props;

    return (
      <div className="content_show">
        <div className="content_showhead">
          <h1>{title}</h1>
          <p>{descr}</p>
        </div>
        <div className="content_right">
          {prev && <a href={`/rooms/manage/${room_id}/${prev}`} className="right_save">Back</a>}
          {next && <a href={`/rooms/manage/${room_id}/${next}`} className="right_save_continue ml-1" >Next</a>}
        </div>
      </div>
    );
  }
}

export default ManageRoomHeader;