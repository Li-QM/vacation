import React from 'react';
import { Link } from 'react-router-dom';

import { Masks } from 'components';
import { ActionBox } from 'components/static/ActionBox';
import { StepBox } from 'components/static/StepBox';
import { ListingSlider } from 'components/static/ListingSlider';

import { staticPageService } from 'services/static/staticPage';
import 'assets/styles/pages/static/staticpage.scss';

class StaticPages extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      name: null,
      excerpt: null,
      content: null,
      h1_tag: null,
      permalink_parent_name: null,
      meta_title: null,
      children: [],
      under: 'company'
    }
  }
  componentDidMount() {
    staticPageService.getPageContent(this.props.match.params.slug).then(res => {
      if (res) {
        this.setState({
          id: res.id,
          name: res.name,
          excerpt: res.excerpt,
          permalink_parent_name: res.permalink_parent_name,
          h1_tag: res.h1_tag,
          meta_title: res.meta_title,
          image_url: res.image_url,
          under: res.under,
          template_id: res.template_id,
          children: res.children,
          content: res.content
        })
      }
    })
  }

  render() {
    if (this.state.template_id === null) {
      return <main role="main" id="site-content">
        <div className="page-style-null">
          <div className="row-space-top-6 row-space-16 text-wrap">
            <p id="page_content" dangerouslySetInnerHTML={{ __html: this.state.content }}></p>
          </div>
        </div>
      </main>
    }

    if (this.state.template_id === 8) {
      return <main role="main" id="site-content">
        <div className="page-style-8">
          <div className="row-space-top-6 row-space-16 text-wrap">
            <p id="page_content" dangerouslySetInnerHTML={{ __html: this.state.content }}></p>
          </div>
        </div>
      </main>
    }

    if (this.state.template_id === 1) {
      return <main role="main" id="site-content">
        <section className="hg_section--relative p-0">
          <div className="container-fluid no-pad-cols">
            <div className="row">
              <div className="col-sm-12 col-md-12">
                {/* Media container style 2 - with custom minimum height(.min-600) */}
                <div className="media-container style2 min-h-400 d-flex align-items-center justify-content-center">
                  {/* Background with parallax effect */}
                  <div className="kl-bg-source kl-bgSource-imageParallax js-KyHtmlParallax is-fixed">
                    {/* Background image */}
                    <div className="kl-bg-source__bgimage" style={{ backgroundImage: `url(${this.state.image_url})` }} />
                    {/*/ Background image */}
                    {/* Color overlay */}
                    <div className="kl-bg-source__overlay" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }} />
                    {/*/ Color overlay */}
                    {/* Gloss overlay */}
                    <div className="kl-bg-source__overlay-gloss" />
                    {/*/ Gloss overlay */}
                  </div>
                  {/*/ Background with parallax effect */}
                  <div className="media-container__link media-container__link--btn media-container__link--style-borderanim2 py-2 d-flex flex-column justify-content-center">
                    <div className="row">
                      <div className="borderanim2-svg text-center mx-auto">
                        <svg height={70} width={400} xmlns="http://www.w3.org/2000/svg">
                          <rect className="borderanim2-svg__shape" x={0} y={0} height={70} width={400} />
                        </svg>
                        <span className="media-container__text"> <span className="white" title={this.state.meta_title}>{this.state.name}</span> </span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-10 col-md-12 float-none mx-auto">
                        <div className="text-center pt-1">
                          <h2 className="tbk__title kl-font-alt fs-xs-xl fs-l fw-bold white">
                            {this.state.permalink_parent_name}
                          </h2>
                          {
                            this.state.h1_tag && <div className="row">
                              <p className="white mt-2 text-center w-100">
                                <span className="d-block fs-xs-md fs-22">
                                  {this.state.h1_tag}
                                </span>
                              </p>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*/ Link button with pop-up */}
                </div>
                {/*/ Media container style 2 - with custom minimum height(.min-600) */}
              </div>
              {/*/ col-sm-12 col-md-12 */}
            </div>
            {/*/ row */}
          </div>
          {/*/ container-fluid */}
          <Masks mode={3} />
        </section>
        <section className="hg_section bg-white pt-40 pb-40">
          <div className="container ">
            <StepBox mode={4} />
          </div>
          <Masks mode={12} />
        </section>
        <section className="hg_section--relative pt-80 pb-100 mb-0">
          <div className="container ">
            <div className="callout-banner">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-9">
                  <h4 className="m_title">{this.state.excerpt}</h4>
                  <p id="page_content" dangerouslySetInnerHTML={{ __html: this.state.content }}></p>
                </div>
                <div className="col-12 col-sm-12 col-md-3">
                  <ActionBox mode={5} />
                  {/* @include('components.action_boxes.style_5') */}
                </div>
              </div>
            </div>
          </div>
          <Masks mode={11} />
        </section>
        <section className="hg_section--relative pb-80 pt-80 mb-0 container">
          <div className="">
            <div className="row">
              <h2 className="wgt-title">
                <span className="tcolor-ext">{this.state.name}</span> Vacation Rentals </h2>
              <div className="col-12">
                <ListingSlider area={'state'} mode={3} page_name={this.state.name} />
                {/* @include('components.listing_widget.listing_slider_style_3',['type' =&gt; 'state']) */}
              </div>
            </div>
          </div>
          <Masks mode={6} />
        </section>
        {
          this.state.children.length > 0 &&
          <section className="hg_section--relative p-0 m-0">
            <div className=" p-5">
              <div className="row">
                <div className="col-12 col-sm-12">
                  <div className="d-flex justify-content-center">
                    <h2 className="title-text fs-jumbo fw-extrabold align-self-center tcolor">
                      {
                        this.state.children.map((child, index) => {
                          return (
                            <Link to={child.permalinkable.template_id === 2 ? `/city/${child.slug}` : `#`} title={child.permalinkable.name} key={index}>
                              {child.permalinkable.name}
                            </Link>
                          )
                        })
                      }
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </section>
        }
      </main>
    }

    if (this.state.template_id === 2) {
      return <main role="main" id="site-content">
        <section className="hg_section--relative p-0">
          <div className="container-fluid no-pad-cols">
            <div className="row">
              <div className="col-sm-12 col-md-12">
                {/* Media container style 2 - with custom minimum height(.min-600) */}
                <div className="media-container style2 min-h-400 d-flex align-items-center justify-content-center">
                  {/* Background with parallax effect */}
                  <div className="kl-bg-source kl-bgSource-imageParallax js-KyHtmlParallax is-fixed">
                    {/* Background image */}
                    <div className="kl-bg-source__bgimage" style={{ backgroundImage: `url(${this.state.image_url})` }} />
                    {/*/ Background image */}
                    {/* Color overlay */}
                    <div className="kl-bg-source__overlay" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }} />
                    {/*/ Color overlay */}
                    {/* Gloss overlay */}
                    <div className="kl-bg-source__overlay-gloss" />
                    {/*/ Gloss overlay */}
                  </div>
                  {/*/ Background with parallax effect */}
                  <div className="media-container__link media-container__link--btn media-container__link--style-borderanim2 py-2 d-flex flex-column justify-content-center">
                    <div className="row">
                      <div className="borderanim2-svg text-center mx-auto">
                        <svg height={70} width={400} xmlns="http://www.w3.org/2000/svg">
                          <rect className="borderanim2-svg__shape" x={0} y={0} height={70} width={400} />
                        </svg>
                        <span className="media-container__text"> <span className="white" title="{{ $page->permalink->seo['meta']['title'] }}">{this.state.name}</span> </span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-10 col-md-12 float-none mx-auto">
                        <div className="text-center pt-1">
                          <h2 className="tbk__title kl-font-alt fs-xs-xl fs-l fw-bold white">
                            {this.state.permalink_parent_name}
                          </h2>
                          {
                            this.state.h1_tag !== '' && <p className="white mt-2">
                              <span className="d-block fs-xs-md fs-22">{this.state.h1_tag}</span>
                            </p>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*/ Link button with pop-up */}
                </div>
                {/*/ Media container style 2 - with custom minimum height(.min-600) */}
              </div>
              {/*/ col-sm-12 col-md-12 */}
            </div>
            {/*/ row */}
          </div>
          {/*/ container-fluid */}
          <Masks mode={3} />
        </section>
        <section className="hg_section bg-white pt-40 pb-40">
          <div className="container ">
            <StepBox mode={4} />
          </div>
          <Masks mode={12} />
        </section>
        <section className="hg_section--relative pt-80 pb-100 mb-0">
          <div className="container ">
            <div className="callout-banner">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-9">
                  <h4 className="m_title">{this.state.excerpt}</h4>
                  <p id="page_content" dangerouslySetInnerHTML={{ __html: this.state.content }}></p>
                </div>
                <div className="col-12 col-sm-12 col-md-3">
                  <ActionBox mode={5} />
                </div>
              </div>
            </div>
          </div>
          <Masks mode={11} />
        </section>
        <section className="hg_section--relative pb-80 pt-80 mb-0 container">
          <div className="">
            <div className="row">
              <h2 className="wgt-title">
                <span className="tcolor-ext">{this.state.name}</span> Vacation Rentals </h2>
              <div className="col-12">
                <ListingSlider area={'city'} mode={3} page_name={this.state.name} />
              </div>
            </div>
          </div>
          <Masks mode={6} />
        </section>
        <section className="hg_section--relative p-0 m-0">
          <div className=" p-5">
            <ListingSlider area={'state'} mode={2} page_name={this.state.permalink_parent_name} section_title={this.state.permalink_parent_name} />
            {/* @include('components.listing_widget.listing_slider_style_2', ['type' =&gt; 'state','tag'=&gt; $page-&gt;permalink_parent_name,'section_title' =&gt; 'More <span className="tcolor">' . $page-&gt;permalink_parent_name . '</span> Rentals', 'section_desc' =&gt; 'We have a wide selection of Vacation Rentals located in <span className="tcolor">' . $page-&gt;permalink_parent_name . '</span> for you to choose from.  <br /><br />Just find your perfect destination, contact the host &amp; get ready to start your dream vacation!']) */}
          </div>
          <Masks mode={1} />
          {/* @include('components.ui_elements.masks',['style'=&gt;'1']) */}
        </section>
      </main>
    }

    if (this.state.under === 'legal') {
    }

    return <div></div>
  }
}

export default StaticPages;