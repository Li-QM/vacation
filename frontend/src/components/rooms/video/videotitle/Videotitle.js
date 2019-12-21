import React from 'react';

class Videotitle extends React.Component {
    render(){
        return(
            <div className="content_show">
                <div className="content_showhead">
                    <h1>Video Can Bring Your Space to Life</h1>
                    <p>Add video of areas guests have access to.</p>
                </div>
                <div className="content_right">
                    <a href={`/rooms/manage/${this.props.roomId}/photos`} className="right_save" >Back</a>
                    <a href={`/rooms/manage/${this.props.roomId}/pricing`} className="right_save_continue" >Next</a>
                </div>
            </div>
        )
    }
}

export default Videotitle;