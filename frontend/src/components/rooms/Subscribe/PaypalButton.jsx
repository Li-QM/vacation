import React from 'react';
import ReactDOM from 'react-dom';
import paypal from 'paypal-checkout';

import { getAuthHeader, API_HOST } from 'services/config';

const PayPalButton = paypal.Button.driver("react", { React, ReactDOM });

export default class PayPalCheckout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptiontype: this.props.planId,
      subscribe_success: false
    };
    this.payment = this.payment.bind(this);
    this.onAuthorize = this.onAuthorize.bind(this);
  }

  onAuthorize(data, actions) {
    let self = this;
    const headers = getAuthHeader();

    return paypal.request
      .post(
        API_HOST + "/ajax/paypal/subscribe/excute?token=" + data.orderID + "&planId=" + this.props.planId + "&roomId=" + this.props.room_id,
        { token: data.orderID },
        {
          headers: {...headers,
          }
        }
      )
      .then(function(response) {
        self.props.paymentSuccess();
        return response;
      });
  }

  payment() {
    let planId = this.props.planId;
    let roomId = this.props.room_id;
    const headers = getAuthHeader();
    return new paypal.Promise(function(resolve, reject) {
      return paypal.request
        .post(
          API_HOST + "/ajax/rooms/post_subscribe_property_paypal/create_plan",
          {roomId: roomId, planId: planId},
          {
            headers: {...headers,
            }
          }
        )
        .then(function(response) {
          resolve(response);
        });
    });
  }

  render() {
    const client = {
      sandbox:
        "Af-PimPKghDsdMCwvPPjQYnsjNBv_jbxBRfWjXeFmWxCmlmXSUCOjwBAU-GOsPJHC5g0KHECJuPwqEqv",
      production:
        "EBXItHpMuh_Yn0rcNWscu7i1RFYg2z_q5iy1nLFtL6dUiKyr2f9yrkMfRvhp0CxySoiRwa6CRrH2zKVp"
    };

    return (
      <PayPalButton
        env={"sandbox"}
        client={client}
        payment={this.payment}
        commit={true} // Optional: show a 'Pay Now' button in the checkout flow
        onAuthorize={this.onAuthorize}
      />
    );
  }
}
