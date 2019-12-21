import React from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import ChatHistory from './ChatHistory';
import Progress from 'react-progressbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faBars, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { chatService } from 'services/chat';
import { alertService } from 'services/alert';
import { API_HOST } from 'services/config';

let canPublish = true;
const throttleTime = 200; //0.2 seconds
const pusher = new Pusher("ccd81a8b36efcabe5a7b", {
  cluster: "mt1",
  encrypted: true,
  disableStats: true
});
class ChatContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      is_open: true,
      message: "",
      chat_history: [],
      file: null,
      uploading_progress: 0,
      uploading: false,
      is_typing: false
    };
    this.chatKeyPress = this.chatKeyPress.bind(this);
    this.chatKeyChange = this.chatKeyChange.bind(this);
    this.openBox = this.openBox.bind(this);
    this.fileChange = this.fileChange.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.uploadFileFromClipboard = this.uploadFileFromClipboard.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.chatBodyScrollTop = this.chatBodyScrollTop.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    // if (prevState.chat_history.length === 0) {
      this.chatBodyScrollTop();
    // }
    //
  }
  getMessages() {
    chatService.getMessages(this.props.user_id, this.props.my_id).then(
      (res) => {
        if (res) {
          this.setState({ chat_history: res });
        } else {
          alertService.showError('Get messages');
        }
      },
      () => {
        this.chatBodyScrollTop();
      }
    );
  }
  componentDidMount() {
    this.getMessages();
    
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
          let req = { message_id: data.message.message.id };
          chatService.readChatMessage(req);
        }
      }
      this.setState(
        {
          chat_history: chat_history
        },
        () => {
          if (this.props.isActive && this.state.is_open) {
            this.chatBodyScrollTop();
          }
        }
      );
    });
  }
  chatBodyScrollTop() {
    let chatDiv = document.getElementById("chat-messages_" + this.props.contactUser.id);
    if (chatDiv && chatDiv.scrollHeight) {
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
  }
  componentWillUnmount() {
    pusher.unsubscribe("chat_" + this.props.my_id);
    this.setState({
      is_open: false
    });

    // document.removeEventListener("click", this.closeMenu);
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
  uploadFile(file) {
    let formData = new FormData();
    formData.append("files", file);
    formData.append("user_id", this.props.contactUser.id);
    formData.append("sender_id", this.props.my_id);
  
    const url = API_HOST + '/ajax/chat/fileupload';

    axios.post(url, formData, {
       onUploadProgress: progressEvent => {
        this.setState({
          uploading_progress: progressEvent.loaded / progressEvent.total,
          uploading: true
        });
      }
    })
    .then(res => {
      if (res) {
        console.log('chat history =>', res)
        this.setState(
          {
            uploading: false,
            uploading_progress: 0,
            chat_history: res.data
          },
          () => {
            this.chatBodyScrollTop();
          }
        );
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
          this.chatBodyScrollTop();
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
            });
            this.chatBodyScrollTop();
          } else {
            alertService.showError('Send message');
          }
        })
      } else {
      }
      this.setState({ message: "" });
    } else {
      if (canPublish) {
        const req = {
          user_id: this.props.contactUser.id,
          sender_id: this.props.my_id
        }
        chatService.sendTypingStatus(req);
        canPublish = false;
        setTimeout(function() { canPublish = true; }, throttleTime);
      }
    }
    this.props.onTyping();
  }
  chatKeyChange(e) {
    this.setState({
      message: e.target.value
    });
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
        this.chatBodyScrollTop();
      }
    );
    if (this.props.my_id) {
      const req = {
        user_id : this.props.contactUser.id,
        sender_id : this.props.my_id,
        message : this.state.message
      }
      chatService.sendChatMessage(req).then(res => {
        if (res) {
          this.setState({
            chat_history : res
          });
          this.chatBodyScrollTop();
        } else {
          alertService.showError('Send message');
        }
      });
    } else {
    }
    this.setState({
      message: ""
    });
  }
  render() {
    let chatDiv = document.getElementById("chat-messages_" + this.props.contactUser.id);
    let chatListDiv = document.getElementById('chat-messages-lists_' + this.props.contactUser.id);
    if (chatDiv && chatDiv.scrollHeight) console.log('chatDiv - r', chatDiv.scrollHeight, chatDiv.scrollTop);
    if (chatListDiv && chatListDiv.clientHeight) console.log('chatListDiv - r', chatListDiv.clientHeight, chatListDiv.scrollTop);

    return (
      <div className="in-chat">
        <div className="chat-header">
          <div className="chat-user-del">
            <div className="respon-arrow" onClick={this.props.handleLeftSidebar}>
              <FontAwesomeIcon icon={faChevronLeft}/>
            </div>
            <div className="chat-user-image">
              <img src={this.props.contactUser.profile_picture.src} alt="Hi" />
              <small className="online status">&nbsp;</small>
            </div>
            <div className="chat-user-info">
              <h4>{this.props.contactUser.full_name}</h4>
              <small>
                {this.props.contactUser.email} &{" "}
                {this.props.contactUser.primary_phone_number}
              </small>
            </div>
          </div>
          <div className="coll-bars" onClick={this.props.handleRightSidebar}>
            <FontAwesomeIcon icon={faBars}/>
          </div>
        </div>
        <div className="chat-body" id={"chat-messages_" + this.props.contactUser.id}>
          <div className="chat-users">
            <ChatHistory
              is_typing={this.state.is_typing}
              chat_history={this.state.chat_history}
              chatUser={this.props.contactUser.id}
            />
          </div>
        </div>
        <div className="chat-fotoer">
          <div className="chat-f-wrap">
            {this.state.uploading ? (<Progress completed={this.state.uploading_progress * 100} />) : null}
            <div className="chat-f-input">
              <div className="chat-o-img">
                <label htmlFor={"file" + this.props.contactUser.id} className="chat_file_upload_label">
                  <svg width="20" height="20" viewBox="0 0 2048 1792" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#23537a" d="M704 576q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm1024 384v448h-1408v-192l320-320 160 160 512-512zm96-704h-1600q-13 0-22.5 9.5t-9.5 22.5v1216q0 13 9.5 22.5t22.5 9.5h1600q13 0 22.5-9.5t9.5-22.5v-1216q0-13-9.5-22.5t-22.5-9.5zm160 32v1216q0 66-47 113t-113 47h-1600q-66 0-113-47t-47-113v-1216q0-66 47-113t113-47h1600q66 0 113 47t47 113z"/>
                  </svg>
                </label>
                <input
                  onChange={this.fileChange}
                  className="chat_file_upload"
                  type="file"
                  id={"file" + this.props.contactUser.id}
                  style={{ display: "none" }}
                />
              </div>
              <div className="chat-o-send">
                {/* <i className="far fa-paper-plane" onClick={this.handleSendMessage}/> */}
                <FontAwesomeIcon icon={faPaperPlane} onClick={this.handleSendMessage}/>
              </div>
              <textarea
                onPaste={this.handlePaste}
                type="text"
                placeholder="Send message..."
                value={this.state.message}
                onKeyPress={this.chatKeyPress}
                onChange={this.chatKeyChange}
              />
            </div>
          </div>
        </div>
        {
          //  this.chatBodyScrollTop()
        }
      </div>
    );
  }
}

export default ChatContainer;
