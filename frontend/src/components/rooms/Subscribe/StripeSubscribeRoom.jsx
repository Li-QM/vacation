import React from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  injectStripe,
} from 'react-stripe-elements';
import 'react-credit-cards/es/styles-compiled.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

class StripeSubscribeRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      card_number: "",
      card_name: "",
      expire_year: "",
      expire_month: "",
      cvc: "",
      coupon_code: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.stripeSubmit = this.stripeSubmit.bind(this);
    this.handleCardChange = this.handleCardChange.bind(this);
  }

  handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  handleCardChange(e, error) {
    console.log(e, error);
  }

  async stripeSubmit(ev) {
    ev.preventDefault();
    let { token } = await this.props.stripe.createToken({ name: "Name" });
    this.props.onSubmit(token, this.state.coupon_code);
  }

  render() {
    const createOptions = {
      style: {
        base: {
          fontSize: "16px",
          color: "#424770",
          letterSpacing: "0.025em",
          "::placeholder": {
            color: "#aab7c4"
          }
        },
        invalid: {
          color: "#c23d4b"
        }
      }
    };
    return (
      <div>
        <form onSubmit={this.stripeSubmit}>
          {/* <CardElement /> */}
          <div className="form-group">
            <label htmlFor="cardNumber">Card number</label>
            <CardNumberElement {...createOptions} />
          </div>
          {/* form-group.// */}
          <div className="row">
            <div className="col-sm-8">
              <div className="form-group">
                <label>
                  <span className="hidden-xs">Expiration</span>{" "}
                </label>
                <CardExpiryElement {...createOptions} />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label
                  data-toggle="tooltip"
                  data-original-title="3 digits code on back side of the card"
                >
                  <span> CVV </span>
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </label>
                <CardCVCElement {...createOptions} />
              </div>{" "}
              {/* form-group.// */}
            </div>
          </div>{" "}
          {/* row.// */}
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <label
                  data-toggle="tooltip"
                  data-original-title="3 digits code on back side of the card"
                >
                  Do you have a coupon code? If so, please enter it here.{" "}
                </label>
                <input
                  name="coupon_code"
                  onChange={this.handleChange}
                  className="form-control col-md-6 col-sm-6 coupon_code border"
                />
              </div>
            </div>
          </div>
          <button className="subscribe btn btn-primary btn-block" type="submit">
            {" "}
            Confirm
          </button>
        </form>
      </div>
    );
  }
}

export default injectStripe(StripeSubscribeRoom);
