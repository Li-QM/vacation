import React from 'react'
import dateFns from "date-fns";
import Linkify  from 'react-linkify'
import { EmojioneV4 } from 'react-emoji-render';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faUser } from '@fortawesome/free-solid-svg-icons';

import { getCookie } from 'services/config';
import { authService } from 'services/auth';

class ChatHistory extends React.PureComponent{
  // constructor(props) {
  //   super(props)
  // }
  componentDidMount() {
    let chatDiv = document.getElementById('chat-messages_' + this.props.chatUser);
    if (chatDiv && chatDiv.clientHeight) chatDiv.scrollTop = chatDiv.scrollHeight;
  }
  
  render() {
    const isLogedIn = authService.isSigned();
    return (
      <ul className="list-unstyled"  id={'chat-messages-lists_' + this.props.chatUser}> 
        {
          isLogedIn 
          ? this.props.chat_history && this.props.chat_history.length > 0 && this.props.chat_history.map((message, index) => {
              return  (
                <li className={message.sender_id === Number(getCookie('user_id')) ? "chat-list list-r" : "chat-list list-l" } key={index}>
                  <div className="chat-user-text">
                    <div className="user-txts">
                      <div className="user-av">
                        <img 
                          src={message.sender_id === Number(getCookie('user_id')) ? message.user_profile_picture : message.sender_profile_picture} 
                          alt="Hi"
                        />
                      </div>
                      <div className="user-txt">
                        <h5>
                          {
                            message.sender_id === Number(getCookie('user_id')) 
                            ? (message.user && message.user.first_name ? message.user.first_name : getCookie('user_name'))
                            : (message.sender && message.sender.first_name ? message.sender.first_name :  getCookie('user_name'))
                          }
                        </h5>
                        {
                          message.type === 'text' ?
                            <Linkify properties={{target: '_blank', style: { fontWeight: 'bold'}}}>
                              <EmojioneV4 size={128} text={message.message}></EmojioneV4 >
                            </Linkify>
                          : <a download href={message.url}>
                            {
                              message.type === 'file' 
                              ? <FontAwesomeIcon icon={faFile}>{message.message}</FontAwesomeIcon>
                              : <img className='chat_preview_image' src={message.url} alt="preview"/>
                            }
                            </a>
                        }
                      </div>
                      <div className="next-txt">
                        <small>{message.created_at ? dateFns.format(new Date(message.created_at), 'h:m, A') : 'Sending...'}, {message.created_at ? (dateFns.differenceInHours(new Date(), new Date(message.created_at)) > 24 ? Math.round(dateFns.differenceInHours(new Date(), new Date(message.created_at))/24) + 'Day Ago' : 'Today' ) : null }</small>
                      </div>
                    </div>
                  </div>
                  {
                    message.final_read_chat ? 
                      <div className='clearfix'>
                        <FontAwesomeIcon icon={faUser} className="final_read_message"/>
                        {
                          this.props.is_typing ? 
                            <div className="typing-indicator">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          : null
                        }
                      </div> 
                    : null
                  }
                </li>
              ) 
            })
          : <label>Please Login to chat with Homeowner</label>
        }
      </ul>
    )
  }
}

export default ChatHistory;