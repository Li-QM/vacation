import React, { Component } from 'react';
// import { Carousel } from 'react-bootstrap';

import 'assets/styles/home/slider.scss'

class CitiesSlider extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
     
  }
   
  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    // if (this.animating) return;
    // const nextIndex = this.state.activeIndex === this.props.slides.length - 1 ? 0 : this.state.activeIndex + 1;
    // this.setState({ activeIndex: nextIndex });
  }

  previous() {
    // if (this.animating) return;
    // const nextIndex = this.state.activeIndex === 0 ? this.props.slides.length - 1 : this.state.activeIndex - 1;
    // this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    // if (this.animating) return;
    // this.setState({ activeIndex: newIndex });
  }

  render() {
    
    // const { activeIndex } = this.state;

    // const slides = this.props.slides.map((item) => {
    //   return (
    //     <Carousel.Item
    //       onExiting={this.onExiting}
    //       onExited={this.onExited}
    //       key={item.src}
    //     >
    //       <img src={item.src} alt={item.altText} />
    //       <Carousel.Caption captionText={item.caption} captionHeader={item.altText} />
    //     </Carousel.Item>
    //   );
    // });

    const item_slide = this.props.slides[0] === undefined ? this.props.slides : this.props.slides[0];

    return (
      <div className="carousel slide">
        <ol className="carousel-indicators">
          <li className="active"></li>
        </ol>
        <div role="list" className="carousel-inner">
          <div className="carousel-item active" role="listitem">
            <img src={item_slide.src ? item_slide.src : ''} alt="Florida"/>
            <div className="carousel-caption d-none d-md-block">
              <h3>{item_slide.altText ? item_slide.altText : ''}</h3>
              <p>{item_slide.caption ? item_slide.caption : ''}</p>
            </div>
          </div>
        </div>
      </div>
      
      // <Carousel
      //   activeIndex={activeIndex}
      //   next={this.next}
      //   previous={this.previous}
      // >
      //   {/* <Carousel.Indicators items={this.props.slides} activeIndex={activeIndex} onClickHandler={this.goToIndex} /> */}
      //   {slides}
      //   <Carousel.Control direction="prev" directionText="Previous" onClickHandler={this.previous} />
      //   <Carousel.Control direction="next" directionText="Next" onClickHandler={this.next} />
      // </Carousel>
    );
  }
}


export default CitiesSlider;