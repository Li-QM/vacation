import React from 'react';
import {Container} from 'components';
import { 
  BannerOne,
  BannerTwo,
  WhyHost,
  Features,
  ActionBar,
  HowItWorks,
  Listing,
} from 'components/home';

import 'assets/styles/pages/home.scss';
import { homeService } from 'services/home';
import { alertService } from 'services/alert';

class HomeComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      home_page_sliders: [],
      home_page_media: 'Slider',
      tags: [],
      small_slide_data: []
    }
  }

  componentDidMount() {
    homeService.getHomeData().then(res => {
      if (res) {
        this.setState({
          home_page_sliders : res.home_page_sliders,
          home_page_media : res.home_page_media,
          tags : res.tags,
          small_slide_data : res.small_slide_data,
        });
      } else {
        alertService.showError('Get Home Data');
      }
    });
  }

  render() {
    return (
      <Container>
        <BannerOne/>
        <HowItWorks/>
        <BannerTwo/>
        <Listing tags={this.state.tags} small_slide_data={this.state.small_slide_data}/>
        <Features/>
        <ActionBar/>
        <WhyHost/>
      </Container>
    )
  }
}

export default HomeComponent;
