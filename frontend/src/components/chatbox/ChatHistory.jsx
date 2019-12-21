import React from "react";
// import dateFns from "date-fns";
import Linkify from "react-linkify";
import { EmojioneV4 } from "react-emoji-render";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faUser } from '@fortawesome/free-solid-svg-icons';

import { authService } from 'services/auth';
import { getCookie } from 'services/config';

class Chathistory extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {}
  onError(e) {
    console.log(e, "Error!!!");
  }
  
  render() {
    const isLogedIn = authService.isSigned();
    return (
      <ul id={"chat-messages-lists_" + this.props.chatUser}>
        {isLogedIn ? (
          this.props.chat_history.map((message, index) => {
            return (
              <li key={index}>
                <div
                  className={
                    message.sender_id === Number(Number(getCookie('user_id')))
                      ? "user-comment-middle"
                      : "admin-comment-area  user-comment-middle"
                  }
                >
                  <div className="user-comment-middle-inner">
                    <p>
                      {message.type === "text" ? (
                        <Linkify
                          properties={{
                            target: "_blank",
                            style: { fontWeight: "bold" }
                          }}
                        >
                          <EmojioneV4
                            svg="true"
                            size={128}
                            text={message.message}
                          ></EmojioneV4>
                        </Linkify>
                      ) : (
                        <a download href={message.url}>
                          {message.type === "file" ? (
                            <div>
                              <FontAwesomeIcon icon={faFile}/>
                              <span>{message.message}</span>
                            </div>
                          ) : (
                            <img className="chat_preview_image" src={message.url} alt="chat preview"/>
                          )}
                        </a>
                      )}
                    </p>
                  </div>
                  {message.final_read_chat ? (
                    <div>
                      <FontAwesomeIcon icon={faUser} className="final_read_message"/>
                      {this.props.is_typing ? (
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })
        ) : (
          <label>Please Login to chat with Homeowner</label>
        )}
      </ul>
    );
  }
}
export default Chathistory;
