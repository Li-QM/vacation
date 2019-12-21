import React from 'react';
import Pusher from 'pusher-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

import ContactList from './ContactList';
import UserChatBox from './UserChatBox';

import { chatService } from 'services/chat';
import { alertService } from 'services/alert';
import { getCookie } from 'services/config';
import { authService } from 'services/auth';

import 'assets/styles/chatbox/chatbox.scss';

const pusher = new Pusher("ccd81a8b36efcabe5a7b", {
  cluster: "mt1",
  encrypted: true,
  disableStats: true
});

class Chatbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogedIn: authService.isSigned(),
      contacts: [],
      chatbox: null,
      active_chatbox: null,
      show_chatbox: true,
      open_chat_box: false
    };
    this.openChat = this.openChat.bind(this);
    this.closeChatBox = this.closeChatBox.bind(this);
    this.handleBoxOpen = this.handleBoxOpen.bind(this);
    this.archiveContact = this.archiveContact.bind(this);
    this.activeContact = this.activeContact.bind(this);
    this.blockContact = this.blockContact.bind(this);
    this.blockContact = this.blockContact.bind(this);
    this.unblockContact = this.unblockContact.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
    this.activeChatBox = this.activeChatBox.bind(this);
    this.notifySoundUrl = "https://res.cloudinary.com/vacation-rentals/video/upload/v1554130121/audio/alarm.mp3";
    this.notifySound = new Audio(this.notifySoundUrl);
  }

  activeChatBox(user_id) {
    this.setState({
      active_chatbox: user_id
    });
  }
  
  openChat(user_id, openOnly = null) {
    let contactUser = null;
    this.state.contacts.map(contact => {
      if (contact.id === user_id) {
        return contactUser = contact;
      }
      return null;
    });
    this.setState({
      chatbox: user_id,
      contactUser: contactUser,
      open_chat_box: true,
      show_chatbox: true
    });
    // console.log(user_id)
  }

  closeChatBox() {
    this.setState({
      chatbox: null
    });
  }

  componentDidMount() {
    if (this.state.isLogedIn === true) {
      chatService.getContactLists().then(res => {
        if (res) {
          this.setState({ contacts: res});
        } else {
          alertService.showError('Get contact list');
        }
      }) 
     
      const channel = pusher.subscribe("chat_" + getCookie('user_id'));
      channel.bind("App\\Events\\MessageSent", data => {
        if (data.message.message.sender_id !== this.state.active_contact) {
          alertService.showSuccess(
            "You received new message from " +
              data.message.message.sender.full_name
          );
          let self = this;
          const playPromise = this.notifySound.play();
          if (playPromise !== null) {
            playPromise.catch(() => {
              self.notifySound.play();
            });
          }
        }
      });

      if (this.props.chatmoduleReducer) {
        if (
          this.props.chatmoduleReducer.is_show !== "undefined" &&
          this.props.chatmoduleReducer.is_show === true
        ) {
          document.getElementById("footer").style.display = "block";
          this.setState(
            {
              show_chatbox: true
            },
            () => {}
          );
        } else {
          document.getElementById("footer").style.display = "none";
          this.setState(
            {
              show_chatbox: false,
              open_chat_box: false
            },
            () => {}
          );
        }
        if (this.props.chatmoduleReducer.contactId) {
          console.log("open chat tracking", this.props.chatmoduleReducer.contactId);
          chatService.getContactLists().then(res => {
            if (res) {
              this.setState(
                {
                  contacts: res.data
                },
                () => {
                  let contactId = this.props.chatmoduleReducer.contactId;
                  let contacts = this.state.contacts;
                  contacts.foreach(contact => {
                    if (contact.contact_id === contactId) {
                      this.setState(
                        {
                          open_chat_box: true,
                          show_chatbox: true
                        },
                        () => {
                          this.openChat(contact.id, 1);
                        }
                      );
                    }
                  });
                }
              );
            } else {
              alertService.showError('Get contact list');
            }
          });
        }
      }
    }
  }
  componentWillUnmount() {
    pusher.unsubscribe("chat_" + getCookie('user_id'));
  }
  archiveContact(contact_id) {
    const req = {
      contactId: contact_id,
      status: "archived",
      userId: getCookie('user_id')
    };
    chatService.updateContactStatus(req).then(res => {
      if (res) {
        this.setState({ contacts: res });
      } else {
        alertService.showError('Update contact status');
      }
    });
  }
  activeContact(contact_id) {
    console.log(contact_id);
    const req = {
      contactId: contact_id,
      status: "active",
      userId: getCookie('user_id')
    };
    chatService.updateContactStatus(req).then(res => {
      if (res) {
        this.setState({ contacts: res });
      } else {
        alertService.showError('Update contact status');
      }
    });
  }
  blockContact(contact_id) {
    const req = {
      contactId: contact_id,
      status: "blocked",
      userId: getCookie('user_id')
    };
    chatService.updateContactStatus(req).then(res => {
      if (res) {
        this.setState({ contacts: res });
      } else {
        alertService.showError('Update contact status');
      }
    });
  }
  unblockContact(contact_id) {
    const req = {
      contactId: contact_id,
      status: "active",
      userId: getCookie('user_id')
    };
    chatService.updateContactStatus(req).then(res => {
      if (res) {
        this.setState({ contacts: res });
      } else {
        alertService.showError('Update contact status');
      }
    });
  }
  deleteContact(contact_id) {
    const req = {
      contactId: contact_id,
      status: "removed",
      userId: getCookie('user_id')
    };
    chatService.updateContactStatus(req).then(res => {
      if (res) {
        this.setState({ contacts: res });
      } else {
        alertService.showError('Update contact status');
      }
    });
  }
  handleBoxOpen() {
    this.setState({
      open_chat_box: !this.state.open_chat_box
    });
  }
  render() {
    if (this.state.isLogedIn === true && this.state.show_chatbox === true)
      return (
        <div className="chat-box">
          <div className={(this.state.open_chat_box ? "chat-window chat-window-open" : "chat-window") + (this.state.chatbox ? " inner-open" : "")}>
            <div className="chat-conversation">
              <div className="chat-head">
                <div>
                  <div className="chat-head-view-enter">
                    <div className="chat-head-view-head">
                      <h3>Hi there <span role="img" aria-label="sheep">👋</span></h3>
                      <p>
                        Helping Vacation.Rentals Owners Property Managers for
                        Over 5 Years. Got a Question? Or Just Saying Hi? Send us
                        a Message.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="chat-body">
                <div className="body-fixed">
                  <div className="body-main">
                    <div className="body-main-wrap">
                      <div className="body-main-card">
                        <div className="body-main-conve">
                          <div className="body-main-content">
                            <div className="body-main-con">
                              <ContactList
                                contacts={this.state.contacts}
                                openChat={this.openChat}
                                active={this.activeContact}
                                archive={this.archiveContact}
                                block={this.blockContact}
                                unblock={this.unblockContact}
                                delete={this.deleteContact}
                              />
                            </div>
                          </div>
                          <div className="body-main-footer">
                            <a
                              className="btn btn-outline-primary"
                              href="/inbox"
                            >
                              <FontAwesomeIcon icon={faCommentAlt}/>
                              Go to Inbox{" "}
                            </a>
                          </div>
                        </div>
                        {this.state.chatbox && (
                          <UserChatBox
                            closeChatBox={this.closeChatBox}
                            isActive={1}
                            onTyping={() =>
                              this.activeChatBox(this.state.contactUser.id)
                            }
                            contactUser={this.state.contactUser}
                            my_id={getCookie('user_id')}
                            my_profile_pic={getCookie('userProfilePic')}
                            user_id={this.state.chatbox}
                            openChat={() => this.openChat(this.state.chatbox)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              this.state.open_chat_box ? "chat-footer open" : "chat-footer"
            }
            onClick={this.handleBoxOpen}
          >
            <FontAwesomeIcon icon={faCommentAlt}/>
            <FontAwesomeIcon icon={faTimes}/>
          </div>
        </div>
      );
    else return null;
  }
}

export default Chatbox;

// const mapStateToProps = state => ({
//   ...state
// });
// const mapDispatchToProps = dispatch => ({
//   openChatBoxAction: () => dispatch(openChatBoxAction)
// });
// export default connect(mapStateToProps, mapDispatchToProps)(Chatbox);
