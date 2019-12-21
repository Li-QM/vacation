import React from 'react';

class Videobutton extends React.Component {
    render(){
        return(
            <div className="calendar_savebuttons col-sm-12"> 
                <a href={`/rooms/manage/${this.props.roomId}/photos`} className="right_save" >Back</a>
                <a href={`/rooms/manage/${this.props.roomId}/pricing`} className="right_save_continue" >Next</a>
            </div>
        )
    }
}

export default Videobutton;