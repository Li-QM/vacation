import React from 'react';
import Pusher from 'pusher-js';

import Contacts from 'components/Inbox/Contacts';
import ChatContainer from 'components/Inbox/ChatContainer';
import ContactProfile from 'components/Inbox/ContactProfile';

import { getCookie } from 'services/config';
import { authService } from 'services/auth';
import { chatService } from 'services/chat';
import { alertService } from 'services/alert';
import 'assets/styles/pages/inbox/inbox.scss';

const pusher = new Pusher("ccd81a8b36efcabe5a7b", {
  cluster: "mt1",
  encrypted: true,
  disableStats: true
});

class Inbox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLogedIn: authService.isSigned(),
      contacts: [],
      chatboxes: [],
      active_chatbox: null,
      show_chatbox: true,
      open_contact_list: false,
      notify_sound: false,
      is_left_sidebar_open: true,
      is_right_sidebar_open: true,
      contactFirstUser: {},
      show_chat_boxes: true,
    };
    this.openChat = this.openChat.bind(this);
    this.activeContact = this.activeContact.bind(this);
    this.archiveContact = this.archiveContact.bind(this);
    this.blockContact = this.blockContact.bind(this);
    this.blockContact = this.blockContact.bind(this);
    this.unblockContact = this.unblockContact.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
    this.activeChatBox = this.activeChatBox.bind(this);
    this.openContactList = this.openContactList.bind(this);
    this.handleLeftSidebar = this.handleLeftSidebar.bind(this);
    this.handleRightSidebar = this.handleRightSidebar.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);

    this.notifySoundUrl = "https://res.cloudinary.com/vacation-rentals/video/upload/v1554130121/audio/alarm.mp3";
    this.notifySound = new Audio(this.notifySoundUrl);
  }

  notify() {
    this.setState({ notify_sound: true }, () => {
      this.notifySound.play();
      this.setState({ notify_sound: false });
    });
  }
  activeChatBox(user_id) {
    this.setState({
      active_chatbox: user_id
    });
  }
  updateContactState(contact_id, status) {
    const req = {
      contactId: contact_id,
      status: status,
      userId: getCookie('user_id')
    }
    chatService.updateContactStatus(req).then(res => {
      if (res) {
        this.setState({
          contacts: res
        });
      } else {
        alertService.showError('Updata contact status');
      }
    })
  }
  archiveContact(contact_id) {
    this.updateContactState(contact_id, "archived");
  }
  activeContact(contact_id) {
    console.log(contact_id)
    if (this.state.open_contact_list) {
      this.setState({
        open_contact_list: !this.state.open_contact_list,
        active_contact: contact_id,
        is_right_sidebar_open : true,
        is_left_sidebar_open : true
      })
    }
    else {
      this.setState({
        // open_contact_list : !this.state.open_contact_list,
        active_contact: contact_id,
        is_right_sidebar_open : true,
        is_left_sidebar_open : true
      })
    }
  }
  blockContact(contact_id) {
    this.updateContactState(contact_id, "blocked");
  }
  unblockContact(contact_id) {
    this.updateContactState(contact_id, "active");
  }
  deleteContact(contact_id) {
    this.updateContactState(contact_id, "removed");
  }
  openChat(user_id, openOnly = null) {
    let chatboxes = this.state.chatboxes;
    if (openOnly === 1) {
      if (!chatboxes.includes(user_id)) {
        chatboxes.push(user_id);
      }
    } else {
      if (chatboxes.includes(user_id)) {
        var index = chatboxes.indexOf(user_id);
        if (index > -1) {
          chatboxes.splice(index, 1);
        }
      } else {
        chatboxes.push(user_id);
        this.setState({
          active_chatbox: user_id
        });
      }
    }
    this.setState({
      chatboxes: chatboxes
    });
    // console.log(user_id)
  }
  componentWillUnmount() {
    document.body.classList.remove('body-inbox');
    this.setState({ show_chat_boxes: true });
    pusher.unsubscribe("chat_" + getCookie('user_id'));
  }
  componentDidMount() {
    document.body.classList.add('body-inbox');
    if (this.state.isLogedIn === true) {
      this.setState({ show_chat_boxes: false });
      chatService.getContactLists().then(res => {
        if (res) {
          let contactFirstUser = null;
          let flag = false;
          res.forEach((contact, index) => {
            if (contact.status === "active" && !flag) {
              contactFirstUser = contact;
              flag = true;
            }
          });
          this.setState({
            contacts: res,
            contactFirstUser: contactFirstUser
          });
        } else {
          alertService.showError('Get contact lise');
        }
      });
    }
    const channel = pusher.subscribe("chat_" + getCookie('user_id'));
    channel.bind("App\\Events\\MessageSent", data => {
      if (data.message.message.sender_id !== this.state.active_contact) {
        alertService.showSuccess("You received new message from " + data.message.message.sender.full_name);
        const playPromise = this.notifySound.play();
        if (playPromise !== null) {
          playPromise.catch(() => {
            this.notifySound.play();
          });
        }
      }
    });
  }

  // activeContact(contact_id) {
  //   console.log(contact_id);
  //   if (this.state.open_contact_list) {
  //     this.setState({
  //       open_contact_list: !this.state.open_contact_list,
  //       active_contact: contact_id,
  //       is_right_sidebar_open: true,
  //       is_left_sidebar_open: true
  //     });
  //   } else {
  //     this.setState({
  //       active_contact: contact_id,
  //       is_right_sidebar_open: true,
  //       is_left_sidebar_open: true
  //     });
  //   }
  // }
  openContactList() {
    this.setState({
      open_contact_list: !this.state.open_contact_list,
      is_right_sidebar_open: true,
      is_left_sidebar_open: true
    });
  }
  handleLeftSidebar() {
    this.setState({
      is_left_sidebar_open: !this.state.is_left_sidebar_open
    });
  }
  handleRightSidebar() {
    this.setState({
      is_right_sidebar_open: !this.state.is_right_sidebar_open
    });
  }
  handleOverlayClick() {
    this.setState({
      is_right_sidebar_open: true,
      is_left_sidebar_open: true
    });
  }

  render() {
    return (
      <div className={ "inbox_" + (this.state.is_left_sidebar_open ? "" : " open-left") + (this.state.is_right_sidebar_open ? "" : " open-right") }>
        <div className="inbox-wrapper">
          <div className="overlay" onClick={this.handleOverlayClick} />
            <Contacts
              is_open={this.state.open_contact_list}
              activeContact={contactId => this.activeContact(contactId)}
              contacts={this.state.contacts}
              active={this.activeContact}
              archive={this.archiveContact}
              block={this.blockContact}
              unblock={this.unblockContact}
              delete={this.deleteContact}
            />
            {
              this.state.active_contact ? (
                this.state.contacts.map(contact => {
                  if (contact.id === this.state.active_contact) {
                    return (
                      <ChatContainer
                        handleRightSidebar={this.handleRightSidebar}
                        handleLeftSidebar={this.handleLeftSidebar}
                        openContact={() => this.openContactList()}
                        isActive={this.state.active_contact === contact.id}
                        onTyping={() => this.activeChatBox(contact.id)}
                        contactUser={contact}
                        my_id={getCookie('user_id')}
                        my_profile_pic={getCookie('userProfilePic')}
                        user_id={contact.id}
                        openChat={() => this.openChat(contact.id)}
                      />
                    );
                  }
                  return null;
                })
              ) : this.state.contacts.length ? (
                <ChatContainer
                  handleRightSidebar={this.handleRightSidebar}
                  handleLeftSidebar={this.handleLeftSidebar}
                  openContact={() => this.openContactList()}
                  isActive={
                    this.state.active_contact === this.state.contactFirstUser.id
                  }
                  onTyping={() =>
                    this.activeChatBox(this.state.contactFirstUser.id)
                  }
                  contactUser={this.state.contactFirstUser}
                  my_id={getCookie('user_id')}
                  my_profile_pic={getCookie('userProfilePic')}
                  user_id={this.state.contactFirstUser.id}
                  openChat={() => this.openChat(this.state.contactFirstUser.id)}
                />
              ) : null
            }
          {
            this.state.active_contact ? (
              this.state.contacts.map(contact => {
                if (contact.id === this.state.active_contact) {
                  return (
                    <ContactProfile
                      openContact={() => this.openContactList()}
                      isActive={this.state.active_contact === contact.id}
                      onTyping={() => this.activeChatBox(contact.id)}
                      contactUser={contact}
                      my_id={getCookie('user_id')}
                      my_profile_pic={getCookie('userProfilePic')}
                      user_id={contact.id}
                      openChat={() => this.openChat(contact.id)}
                    />
                  );
                }
                return null;
              })
            ) : this.state.contacts.length ? (
              <ContactProfile
                openContact={() => this.openContactList()}
                isActive={
                  this.state.active_contact === this.state.contactFirstUser.id
                }
                onTyping={() =>
                  this.activeChatBox(this.state.contactFirstUser.id)
                }
                contactUser={this.state.contactFirstUser}
                my_id={getCookie('user_id')}
                my_profile_pic={getCookie('userProfilePic')}
                user_id={this.state.contactFirstUser.id}
                openChat={() => this.openChat(this.state.contactFirstUser.id)}
              />
            ) : null
          }
        </div>
      </div>
    );
  }
}

// const mapStateToProps = state => ({
//   ...state
// });
// const mapDispatchToProps = dispatch => ({
//   hideChatBoxes: () => dispatch(hideChatBoxes()),
//   showChatBoxes: () => dispatch(showChatBoxes())
// });
// export default connect(mapStateToProps, mapDispatchToProps)(Inbox);
export default Inbox;
