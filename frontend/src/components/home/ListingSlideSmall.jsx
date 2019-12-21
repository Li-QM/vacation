import React from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
 
class ListingSlideSmall extends React.PureComponent {
  // constructor(props){
  //   super(props)
  // }
  
  render() {
    const settings = {
      lazyLoad: true,
      arrows: true,
      dots : false,
      centerPadding: "60px",
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      initialSlide: 0,
      className: "center",
      responsive: [
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
            infinite: true,
            dots: false
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true,
            dots: false
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
            dots: false
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false
          }
        }
      ]
    };

    // const slide_data = [
    //   {name: 'Beautifully furnished villa  western exposure  3 bed  3 bath  hot tub  boat fee', featured_image: 'https://res.cloudinary.com/vacation-rentals/image/upload/c_fill,h_200,w_200/images/rooms/11449/1537696269_7980_.webp', address_url: 'cape-coral-florida-3-bedroom-3-bathroom-house', room_id: '11449', short_description: '3 Bedroom  House in Cape Coral Florida'},
    //   {name: 'Beautifully furnished villa  western exposure  3 bed  3 bath  hot tub  boat fee', featured_image: 'https://res.cloudinary.com/vacation-rentals/image/upload/c_fill,h_200,w_200/images/rooms/11449/1537696269_7980_.webp', address_url: 'cape-coral-florida-3-bedroom-3-bathroom-house', room_id: '11449', short_description: '3 Bedroom  House in Cape Coral Florida'},
    //   {name: 'Beautifully furnished villa  western exposure  3 bed  3 bath  hot tub  boat fee', featured_image: 'https://res.cloudinary.com/vacation-rentals/image/upload/c_fill,h_200,w_200/images/rooms/11449/1537696269_7980_.webp', address_url: 'cape-coral-florida-3-bedroom-3-bathroom-house', room_id: '11449', short_description: '3 Bedroom  House in Cape Coral Florida'},
    //   {name: 'Beautifully furnished villa  western exposure  3 bed  3 bath  hot tub  boat fee', featured_image: 'https://res.cloudinary.com/vacation-rentals/image/upload/c_fill,h_200,w_200/images/rooms/11449/1537696269_7980_.webp', address_url: 'cape-coral-florida-3-bedroom-3-bathroom-house', room_id: '11449', short_description: '3 Bedroom  House in Cape Coral Florida'},
    //   {name: 'Beautifully furnished villa  western exposure  3 bed  3 bath  hot tub  boat fee', featured_image: 'https://res.cloudinary.com/vacation-rentals/image/upload/c_fill,h_200,w_200/images/rooms/11449/1537696269_7980_.webp', address_url: 'cape-coral-florida-3-bedroom-3-bathroom-house', room_id: '11449', short_description: '3 Bedroom  House in Cape Coral Florida'},
    //   {name: 'Beautifully furnished villa  western exposure  3 bed  3 bath  hot tub  boat fee', featured_image: 'https://res.cloudinary.com/vacation-rentals/image/upload/c_fill,h_200,w_200/images/rooms/11449/1537696269_7980_.webp', address_url: 'cape-coral-florida-3-bedroom-3-bathroom-house', room_id: '11449', short_description: '3 Bedroom  House in Cape Coral Florida'},
    // ];

    const slide_data = this.props.slide_data;

    let slide_list = slide_data.map((slide, index) => {
      return (
        <div className="post hsize-150" key={index}>
          <Link to="#" className="hoverBorder">
            <span className="hoverBorderWrapper">
              <img src={slide.featured_image} className="img-fluid img-cover h-100" alt="unique" title={slide.name} />
              <span className="theHoverBorder" />
            </span>
          </Link>
          <div className="post-details pb-1 bg-black-trans-50">
            <h6 className="m_title">
            <Link to = {`/homes/${slide.address_url}/${slide.room_id}`} title={slide.name}>
                {slide.short_description.replace('messages.rooms.bedroom', 'Bedroom | Bedrooms')}
            </Link>
            </h6>
          </div>
        </div>
      )
    })  
    
    if(slide_list.length){
      return (
        <div className="swiper-slide">
          <Slider {...settings}>
            {slide_list}
          </Slider>
        </div>
      );
    }
    else{
      return <div></div>
    }
  }
}

export default ListingSlideSmall;