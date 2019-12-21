import React from 'react';

import { alertService } from 'services/alert';
import { chatService } from 'services/chat';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

import 'assets/styles/pages/contactus.scss';

class ContactUs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone_number: '',
      feedback: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.email]: event.target.value,
      [event.target.feedback]: event.target.value
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      name: "",
      email: "",
      feedback: ""
    });
    const req = {
      name: this.state.name,
      email: this.state.email,
      phone_number: this.state.phone_number,
      account_type: this.state.account_type,
      feedback: this.state.feedback
    }
    /* Disable Send Message Feature */
    chatService.getMail({data: req}).then(res => {
      if (res) {
        alertService.showSuccess("Thank you!", "We will contact you shortly!");
      }
    })
  }
  render() {
    return (
      <main>
        {/* contact starts */}
        <section className="contact-page" style={{ marginTop: "97px" }}>
          <div className="contact_inner">
            <div className="contact-map">
              <iframe
                title="contact map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51217.84283639826!2d-93.29805190049649!3d36.64767968953203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87cf01e9c1f60ea9%3A0xf3370960da92ac34!2sBranson%2C+MO+65616%2C+USA!5e0!3m2!1sen!2sin!4v1554930946066!5m2!1sen!2sin"
                width="100%"
                frameBorder={0}
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>
            <div className="con-mid">
              <div className="container">
                <div className="row">
                  <div className="col-md-8">
                    <div className="con-l">
                      <div className="con-wrapper">
                        <h4>Contact Us</h4>
                        <form className="row" onSubmit={this.handleSubmit}>
                          <div className="col-md-6">
                            <div className="con-list">
                              <label>Name</label>
                              <input
                                type="text"
                                placeholder="Enter your name"
                                aria-label="name"
                                name="name"
                                value={this.state.name}
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="con-list">
                              <label>Email Address</label>
                              <input
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                aria-label="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="con-list">
                              <label>I'm</label>
                              <select
                                aria-label="account type"
                                onChange={this.handleChange}
                              >
                                <option value="">Select</option>
                                <option value="traveler">Traveler</option>
                                <option value="owner">Owner/Manager</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="con-list">
                              <label>Phone</label>
                              <input
                                type="text"
                                name="phone_number"
                                placeholder="Enter your phone number"
                                aria-label="phone_number"
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="con-list">
                              <label>Message</label>
                              <div className="rel-in">
                                <textarea
                                  type="text"
                                  name="feedback"
                                  row={2}
                                  aria-label="feedback"
                                  value={this.state.feedback}
                                  onChange={this.handleChange}
                                />
                                <button
                                  type="submit"
                                  aria-label="submit"
                                  alignitems="center"
                                >
                                  <svg
                                    height="32"
                                    viewBox="0 0 24 24"
                                    width="22"
                                  >
                                    <path
                                      d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693 12.643-7.911c.595-.394 1.136-.176.691.218z"
                                      fill="#fff"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="con-r">
                      <div className="con-wrapper">
                        <h4>Contact Information</h4>
                        <ul className="cont-list-parent">
                          <li>
                            <FontAwesomeIcon icon={faMapMarker} />
                            <span>Branson, Missouri 65616</span>
                          </li>
                          <li>
                            <FontAwesomeIcon icon={faPhone} />
                            <span>
                              <a href="tel:(417) 232-6205">417 230 0717</a>
                            </span>
                          </li>
                          <li>
                            <FontAwesomeIcon icon={faEnvelope} />
                            <span>
                              <a href="mailto:sales@vacation.rentals">
                                sales@vacation.rentals
                              </a>
                            </span>
                          </li>
                        </ul>
                        <ul className="social-links">
                          <li>
                            <a
                              href="https://www.facebook.com/www.vacation.rentals/"
                              aria-label="facebook link"
                            >
                              <svg
                                viewBox="0 0 48 48"
                                width="27px"
                                height="27px"
                              >
                                <path
                                  fill="#ffffff"
                                  d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
                                />
                                <path
                                  fill="#1f4767"
                                  d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287C31.104,17,31,17.6,31,18.723V21h4L34.368,25z"
                                />
                              </svg>
                            </a>
                          </li>

                          <li>
                            <a
                              href="https://twitter.com/Vacarent"
                              aria-label="twitter link"
                            >
                              <svg
                                fill="#ffffff"
                                viewBox="0 0 50 50"
                                width="27px"
                                height="27px"
                              >
                                <path d="M 50.0625 10.4375 C 48.214844 11.257813 46.234375 11.808594 44.152344 12.058594 C 46.277344 10.785156 47.910156 8.769531 48.675781 6.371094 C 46.691406 7.546875 44.484375 8.402344 42.144531 8.863281 C 40.269531 6.863281 37.597656 5.617188 34.640625 5.617188 C 28.960938 5.617188 24.355469 10.21875 24.355469 15.898438 C 24.355469 16.703125 24.449219 17.488281 24.625 18.242188 C 16.078125 17.8125 8.503906 13.71875 3.429688 7.496094 C 2.542969 9.019531 2.039063 10.785156 2.039063 12.667969 C 2.039063 16.234375 3.851563 19.382813 6.613281 21.230469 C 4.925781 21.175781 3.339844 20.710938 1.953125 19.941406 C 1.953125 19.984375 1.953125 20.027344 1.953125 20.070313 C 1.953125 25.054688 5.5 29.207031 10.199219 30.15625 C 9.339844 30.390625 8.429688 30.515625 7.492188 30.515625 C 6.828125 30.515625 6.183594 30.453125 5.554688 30.328125 C 6.867188 34.410156 10.664063 37.390625 15.160156 37.472656 C 11.644531 40.230469 7.210938 41.871094 2.390625 41.871094 C 1.558594 41.871094 0.742188 41.824219 -0.0585938 41.726563 C 4.488281 44.648438 9.894531 46.347656 15.703125 46.347656 C 34.617188 46.347656 44.960938 30.679688 44.960938 17.09375 C 44.960938 16.648438 44.949219 16.199219 44.933594 15.761719 C 46.941406 14.3125 48.683594 12.5 50.0625 10.4375 Z" />
                              </svg>
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://www.linkedin.com/in/vacarent"
                              aria-label="linkedin link"
                            >
                              <svg
                                viewBox="0 0 48 48"
                                width="27px"
                                height="27px"
                              >
                                <path
                                  fill="#ffffff"
                                  d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
                                />
                                <path
                                  fill="#1f4767"
                                  d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"
                                />
                              </svg>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* contact ends*/}
      </main>
    );
  }
}

export default ContactUs;
 