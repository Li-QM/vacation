import React from 'react';

import 'assets/styles/pages/homes/listingmenu.scss';

class ListingMenu extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  // }
	
	render() {
    return(
      <div className="listing-menu-top">
        <div className="page-container-responsive p-0">
        <ul>
          <li>
            <h2 className="titled"><font style={{verticalAlign: 'inherit'}}><font style={{verticalAlign: 'inherit'}}>{this.props.room_name}</font></font>
            </h2>
          </li>
          <li>
            {/*<a href="javascript:void(0);" className="link-reset">*/}
              <span className="lang-chang-label">
                <font style={{verticalAlign: 'inherit'}}><font style={{verticalAlign: 'inherit'}}> <a href={this.props.address != null ? (this.props.address.city ? '/search?locations='+this.props.address.city : '#') : ''} >{this.props.address != null ? (this.props.address.city ? this.props.address.city + ',' : '') : ''}</a> </font></font>
              </span>
              <span className="lang-chang-label" >
                <font style={{verticalAlign: 'inherit'}}><font style={{verticalAlign: 'inherit'}}> <a href={this.props.address != null ? (this.props.address.state ? '/search?locations='+this.props.address.state : '#') : ''} >{this.props.address != null ? (this.props.address.state ? this.props.address.state + ',' : '' ) : ''}</a> </font></font>
              </span>
              <span className="lang-chang-label" >
                <font style={{verticalAlign: 'inherit'}}><font style={{verticalAlign: 'inherit'}}> <a href={this.props.address != null ? (this.props.address.country_name ? '/search?locations='+this.props.address.country_name : '#') : ''} >{this.props.address != null ? (this.props.address.country_name ? this.props.address.country_name + ',' : '' ) : ''}</a></font></font>
              </span>
            {/*</a>*/}
          </li>
        </ul>
        </div>
      </div>
    );
  }
}

export default ListingMenu;