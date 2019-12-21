import React from 'react'
import { Masks } from 'components'
// import SearchBar from './SearchBar'
import SearchBarWrapper from './SearchBarWrapper'
import 'assets/styles/home/banner.scss';

const styles = {
  sliderImage: {
    height: '100%',
    top: 'unset',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

class BannerOne extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      is_placeholder_visible: true
    };

    this.onSearchbarLoaded = this.onSearchbarLoaded.bind(this);
  }

  onSearchbarLoaded() {
    setTimeout(() => {
      this.setState({is_placeholder_visible: false});
    }, 300);
  }
  
  render() {
    // const state = this.state;
    const home_page_media = 'Slider';

    // const home_page_sliders = this.props.home_page_sliders.map((slider) => {
    //   return <li className="slider-image" 
    //     key={slider.id} style={{ backgroundImage: `url(${slider.image_url})`, 
    //     height: '100%', 
    //     top: 'unset', 
    //     backgroundSize: 'cover', 
    //     backgroundPosition: 'center' }}>
    //   </li>
    // });

    const home_page_sliders = [
      (<li className="slider-image" key='1' style={{ ...styles.sliderImage, backgroundImage: 'url("https://res.cloudinary.com/vacation-rentals/image/upload/c_fill,fl_lossy,h_800,q_auto:low,w_auto/v1/images/slider_1538410411.jpg")' }}/>)
    ];

    const search_guest_options = [];
    for (let i = 1; i <= 30; i++) {
      search_guest_options.push(i < 30 ? <option value={i} key={i}> {i} Guest </option> : <option value={i} key={i}> {i}+ Guest </option>)
    }

    return (
      <div className="hero">
        <div className="hero-background" data-native-currency="ZAR" aria-hidden="true">
          { home_page_media === 'Slider' ?
            <ul className="rslides" id="home_slider">{home_page_sliders}</ul>
            :
            <video autoplay loop="loop" id="pretzel-video" className="video-playing"></video>
          }
        </div>

        <div className="hero-content page-container-full text-center">
          <div className="va-container">
            <div className="banercont">
              <div className="h3">
                <div className="h1 left_cls">Vacation Rentals From Owners And Property Managers</div>
                <div className="hero-sub-text mt-15 white shadow-text d-flex justify-content-center">
                  <div className="h1 text-container">
                    <div className="animated fadeIn mr-20 d-inline-block delay-4s slower">No Fees.</div>
                    <div className="animated zoomIn slower d-inline-block">No Commissions.</div>
                    <div className="animated fadeIn ml-20 d-inline-block delay-4s slower">100% Verified.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="va-middle">
              <div className="back-black">
                <div className="show-sm hide-md sm-search">
                </div>
              </div>
            </div>
          </div>

          <div className="hero__content-footer hide-sm d-md-flex justify-content-center">
            <div className="col-sm-11 col-md-8">
              <SearchBarWrapper is_placeholder={true} is_placeholder_visible={this.state.is_placeholder_visible}/>
            </div>
          </div>
          
          <div className="hero__content-footer hide-sm d-md-flex justify-content-center">
            <div className="col-sm-11 col-md-8">
              <SearchBarWrapper onLoaded={this.onSearchbarLoaded}/>
            </div>
          </div>

        </div>
        
        <Masks mode={4} />
      </div>
    )
  }
}

export default BannerOne;
