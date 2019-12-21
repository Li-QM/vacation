import React from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import Progress from 'react-progressbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faLink, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import Chathistory from './ChatHistory';
import { chatService } from 'services/chat';
import { alertService } from 'services/alert';

let canPublish = true;
const throttleTime = 200; //0.2 seconds
const pusher = new Pusher('ccd81a8b36efcabe5a7b', {
  cluster: "mt1",
  encrypted: true,
  disableStats: true
});
class UserChatBox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      is_open: true,
      message: "",
      chat_history: [],
      file: null,
      uploading_progress: 0,
      uploading: false,
      is_typing: false,
      kbactive: false
    };
    this.chatKeyPress = this.chatKeyPress.bind(this);
    this.chatKeyChange = this.chatKeyChange.bind(this);
    this.openBox = this.openBox.bind(this);
    this.fileChange = this.fileChange.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.uploadFileFromClipboard = this.uploadFileFromClipboard.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleTogglekbactive = this.handleTogglekbactive.bind(this);
  }
  componentDidMount() {
    chatService.getMessages(this.props.user_id, this.props.my_id).then(res => {
      if (res) {
        this.setState({ chat_history: res });
        const chatDiv = document.getElementById("chat-messages_" + this.props.contactUser.id);
        const chatListDiv = document.getElementById("chat-messages-lists_" + this.props.contactUser.id);
          if (chatListDiv && chatListDiv.clientHeight) {
            chatDiv.scrollTop = chatListDiv.clientHeight;
          }
      } else {
        alertService.showError('Get messages');
      }
    });
    const channel = pusher.subscribe("chat_" + this.props.my_id);
    const clearInterval = 900; //0.9 seconds
    let clearTimerId;
    channel.bind("message_read", data => {
      let chat_history = this.state.chat_history;
      chat_history.forEach((history, index) => {
        if (history.id === data.message_id) {
          chat_history[index].final_read_chat = 1;
        } else {
          chat_history[index].final_read_chat = 0;
        }
      });
    });
    channel.bind("is_typing", data => {
      if (data.typing_user === this.props.contactUser.id) {
        this.setState({
          is_typing: true
        });
        let self = this;
        clearTimeout(clearTimerId);
        clearTimerId = setTimeout(function() {
          //clear user is typing message
          self.setState({
            is_typing: false
          });
        }, clearInterval);
      }
    });
    channel.bind("App\\Events\\MessageSent", data => {
      let chat_history = this.state.chat_history;
      if (data.message.message.sender_id === this.props.contactUser.id) {
        chat_history.push(data.message.message);
        if (this.props.isActive && this.state.is_open) {
          const req = {message_id: data.message.message};
          chatService.readChatMessage(req).then(res => {
            if (res) {
            } else {
              alertService.showError('Read chat message');
            }
          })
        }
      }
      this.setState(
        {
          chat_history: chat_history
        },
        () => {
          let chatDiv = document.getElementById("chat-messages_" + this.props.contactUser.id);
          let chatListDiv = document.getElementById("chat-messages-lists_" + this.props.contactUser.id);
          if (chatListDiv && chatListDiv.clientHeight) {
            chatDiv.scrollTop = chatListDiv.clientHeight;
          }
        }
      );
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.chat_history.length === 0) {
      this.chatBodyScrollTop();
    }
  }
  componentWillUnmount() {
    pusher.unsubscribe("chat_" + this.props.my_id);
    this.setState({
      is_open: false
    });
  }
  handlePaste(e) {
    for (let i = 0; i < e.clipboardData.items.length; i++) {
      let item = e.clipboardData.items[i];
      if (item.type.indexOf("image") !== -1) {
        this.uploadFileFromClipboard(item.getAsFile());
      } else {
      }
    }
  }
  chatBodyScrollTop() {
    let chatDiv = document.getElementById(
      "chat-messages_" + this.props.contactUser.id
    );
    chatDiv.scrollTop = document.getElementById(
      "chat-messages-lists_" + this.props.contactUser.id
    ).clientHeight;
  }
  handleSendMessage(e) {
    e.preventDefault();
    let chat_history = this.state.chat_history;
    chat_history.push({
      user_id: this.props.contactUser.id,
      sender_id: this.props.my_id,
      type: "text",
      message: this.state.message,
      sender_profile_picture: this.props.my_profile_pic
    });
    this.setState(
      {
        chat_history: chat_history
      },
      () => {
        //   setTimeout(3000)
        const chatDiv = document.getElementById("chat-messages_" + this.props.contactUser.id);
        const chatListDiv = document.getElementById("chat-messages-lists_" + this.props.contactUser.id);
        if (chatListDiv && chatListDiv.clientHeight) {
          chatDiv.scrollTop = chatListDiv.clientHeight;
        }
      }
    );
    if (this.props.my_id) {
      const req = {
        user_id: this.props.contactUser.id,
        sender_id: this.props.my_id,
        message: this.state.message
      }
      chatService.sendChatMessage(req).then(res => {
        if (res) {
          this.setState({
            chat_history: res
          })
          const chatDiv = document.getElementById("chat-messages_" + this.props.contactUser.id);
          const chatListDiv = document.getElementById("chat-messages-lists_" + this.props.contactUser.id);
          if (chatListDiv && chatListDiv.clientHeight) {
            chatDiv.scrollTop = chatListDiv.clientHeight;
          }
        } else {
          alertService.showError('Send chat message');
        }
      })
    } else {
    }
    this.setState({
      message: ""
    });
  }
  uploadFile(file) {
    let formData = new FormData();
    formData.append("files", file);
    formData.append("user_id", this.props.contactUser.id);
    formData.append("sender_id", this.props.my_id);
    
     axios.post( '/ajax/chat/fileupload', formData,  {
        onUploadProgress: progressEvent => {
          this.setState({
            uploading_progress : progressEvent.loaded / progressEvent.total,
            uploading : true
          })
        }
      }).then(res => {
        if (res) {
          this.setState(
            {
              uploading: false,
              uploading_progress: 0,
              chat_history: res
            },
            () => {
              const chatDiv = document.getElementById("chat-messages_" + this.props.contactUser.id);
              chatDiv.scrollTop = document.getElementById("chat-messages-lists_" + this.props.contactUser.id).clientHeight;
            }
          );
        } else {
          alertService.showError('Upload file');
        }
      })
      .catch(e => {
        this.setState({
          uploading: false,
          uploading_progress: 0
        });
      });
  }
  uploadFileFromClipboard(file) {
    this.uploadFile(file);
  }
  fileChange(e) {
    e.preventDefault();
    this.uploadFile(e.target.files[0]);
  }
  openBox() {
    this.setState({
      is_open: !this.state.is_open
    });
  }
  chatKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      let chat_history = this.state.chat_history;
      chat_history.push({
        user_id: this.props.contactUser.id,
        sender_id: this.props.my_id,
        type: "text",
        message: this.state.message,
        sender_profile_picture: this.props.my_profile_pic
      });
      this.setState(
        {
          chat_history: chat_history
        },
        () => {
          //   setTimeout(3000)
          const chatDiv = document.getElementById("chat-messages_" + this.props.contactUser.id);
          const chatListDiv = document.getElementById("chat-messages-lists_" + this.props.contactUser.id);
          if (chatListDiv && chatListDiv.clientHeight) {
            chatDiv.scrollTop = chatListDiv.clientHeight;
          }
        }
      );
      if (this.props.my_id) {
        const req = {
          user_id: this.props.contactUser.id,
          sender_id: this.props.my_id,
          message: this.state.message
        }
        chatService.sendChatMessage(req).then(res => {
          if (res) {
            this.setState({
              chat_history: res
            })
            const chatDiv = document.getElementById("chat-messages_" + this.props.contactUser.id);
            const chatListDiv = document.getElementById("chat-messages-lists_" + this.props.contactUser.id);
            if (chatListDiv && chatListDiv.clientHeight) {
              chatDiv.scrollTop = chatListDiv.clientHeight;
            }
          } else {
            alertService.showError('Send chat message');
          }
        })
      } else {
      }
      this.setState({
        message: ""
      });
    } else {
      if (canPublish) {
        const req = {
          user_id: this.props.contactUser.id,
          sender_id: this.props.my_id
        }
        chatService.sendTypingStatus(req).then(res => {
        })
        canPublish = false;
        setTimeout(() => {canPublish = true;}, throttleTime);
      }
    }
    this.props.onTyping();
  }
  chatKeyChange(e) {
    this.setState({
      message: e.target.value
    });
  }
  handleTogglekbactive() {
    this.setState({
      kbactive: !this.state.kbactive
    });
  }
  render() {
    return (
      <div className="body-main-chat">
        <div className="body-expand-header">
          <div className="body-expand-back">
            <button onClick={this.props.closeChatBox}>
              <FontAwesomeIcon icon={faChevronLeft}/>
            </button>
          </div>
          <div className="body-expand-team">
            <div className="body-expand-teamimg">
              <img src={this.props.contactUser.profile_picture.src} alt="contact user" />
            </div>
            <div className="body-expand-teamname">
              <h4>{this.props.contactUser.full_name}</h4>
              <p> {this.props.contactUser.live}</p>
            </div>
          </div>
        </div>
        <div
          className="body-conversation-middle"
          id={"chat-messages_" + this.props.contactUser.id}
        >
          <Chathistory
            is_typing={this.state.is_typing}
            chat_history={this.state.chat_history}
            chatUser={this.props.contactUser.id}
          />
        </div>
        <div className="body-conversation-footer">
          {this.state.uploading ? (
            <Progress completed={this.state.uploading_progress * 100} />
          ) : null}
          <div
            className={
              this.state.kbactive
                ? "body-conversation-inner "
                : "body-conversation-inner kbactive"
            }
            onClick={this.handleTogglekbactive}
          >
            <textarea
              onPaste={this.handlePaste}
              type="text"
              className="chatinput"
              placeholder="Send message..."
              value={this.state.message}
              onKeyPress={this.chatKeyPress}
              onChange={this.chatKeyChange}
            />
            <div className="body-conversation-button">
              <div className="body-button-upload">
                <label htmlFor={"file" + this.props.contactUser.id}>
                  {/* <i className="fas fa-link" /> */}
                  <FontAwesomeIcon icon={faLink} />
                </label>
                <input
                  type="file"
                  onChange={this.fileChange}
                  id={"file" + this.props.contactUser.id}
                />
              </div>
              <div className="body-conversation-submit">
                <button type="button" onClick={this.handleSendMessage}>
                  {/* <i className="fas fa-paper-plane" /> */}
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default UserChatBox;
