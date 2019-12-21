import React from 'react'
import { SocialIcon } from 'react-social-icons';

import 'assets/styles/footer.scss';

export const AppFooter = props => (
  <div id="footer" className="container-brand-dark footer-surround footer-container" style={{ width: '100%' }}>
    <footer className="page-container-responsive">
      <div className="row row-condensed">
        <div className="col-md-3 rj_footer">
          <div className="foot-column">
            <h2 className="h5 font_strong">Company</h2>
            <ul className="list-layout">
              {/* {
                this.state.pages.map((page, index) => {
                  if (page.under == 'company') {
                    return <li key={index}><a href={`/company/${page.permallink && page.permallink.slug ? page.permallink.slug : page.name}`} className="link-contrast">{page.name}</a></li>
                  }
                })
              } */}
              <li><a href="/company/features" className="link-contrast">Features</a></li>
              <li><a href="/pricing" className="link-contrast">Price To List</a></li>
              <li><a href="/blog" className="link-contrast">Blog</a></li>
              <li><a href="/company/our-story" className="link-contrast">Our Story</a></li>
            </ul>
          </div>
        </div>

        {/* <div className="col-md-4 rj_footer">
              <div className="foot-column">
                <h2 className="h5 font_strong">Vacation Rentals</h2>
                <ul className="list-layout">
                  <li><a href="/rentals/florida" className="link-contrast">Florida</a></li>
                  <li><a href="/rentals/colorado" className="link-contrast">Colorado</a></li>
                  <li><a href="/rentals/hawaii" className="link-contrast">Hawaii</a></li>
                  <li><a href="/rentals/florida/kissimmee" className="link-contrast">Kissimmee</a></li>
                </ul>
              </div>
            </div> */}
        <div className="col-md-3 rj_footer">
          <div className="foot-column">
            <h2 className="h5 font_strong">Support</h2>
            <ul className="list-layout">
              {/* {
                this.state.pages.map((page, index) => {
                  if (page.under == 'support') {
                    return <li key={index}><a href={`/support/${page.permallink && page.permallink.slug ? page.permallink.slug : page.name}`} className="link-contrast">{page.name}</a></li>
                  }
                })
              } */}
              {/* <li><a href="/about-us/trust-safety" className="link-contrast">Trust &amp; Safety</a></li> */}
              {/* <li><a href="/services/property-managers-can-list-with-us" className="link-contrast">Property Managers</a></li> */}
              <li><a href="/help" className="link-contrast">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="col-md-3 rj_footer">
          <div className="foot-column">
            <h2 className="h5 font_strong">Site Info</h2>
            <ul className="list-layout">
              {/* {
                this.state.pages.map((page, index) => {
                  if (page.under == 'site-info') {
                    return <li key={index}><a href={`/site-info/${page.permallink && page.permallink.slug ? page.permallink.slug : page.name}`} className="link-contrast">{page.name}</a></li>
                  }
                })
              } */}
              <li><a href="/site-info/why-host" className="link-contrast">Why Host</a></li>
              <li><a href="/contactus" className="link-contrast">Contact Us</a></li>
              <li><a href="/sitemap" className="link-contrast">Sitemap</a></li>
            </ul>
          </div>
        </div>
        <div className="col-md-3 rj_footer">
          <div className="foot-column">
            <h2 className="h5 font_strong">Destinations</h2>
            <ul className="list-layout">
              {/* {
                this.state.pages.map((page, index) => {
                  if (page.under == 'destinations') {
                    return <li key={index}><a href={`/destinations/${page.permallink && page.permallink.slug ? page.permallink.slug : page.name}`} className="link-contrast">{page.name}</a></li>
                  }
                })
              } */}
              <li><a href="/destinations/florida" className="link-contrast">Florida</a></li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="space-top-4 space-4 hide-sm row" />
      <div >
        <h2 className="h5 space-4 text-center">Join Us On</h2>
        <ul className="list-layout list-inline text-center">
          <link itemProp="url" />
          <meta itemProp="logo" />
          <li>
            <SocialIcon network="facebook" url="https://www.facebook.com/www.Vacation.Rentals" target="_blank" rel="noopener"/>
          </li>
          <li>
            <SocialIcon network="reddit" url="https://www.reddit.com/r/Vacationrentals" target="_blank" rel="noopener"/>
          </li>
          <li>
            <SocialIcon network="twitter" url="https://twitter.com/Vacarent" target="_blank" rel="noopener"/>
          </li>
          <li>
            <SocialIcon network="linkedin" url="https://www.linkedin.com/in/vacarent/" target="_blank" rel="noopener"/>
          </li>
          <li>
            <SocialIcon network="pinterest" url="https://www.pinterest.com/nofeevacationrentals" target="_blank" rel="noopener"/>
          </li>
          <li>
            <SocialIcon network="youtube" url="https://www.youtube.com/vacationrentals" target="_blank" rel="noopener"/>
          </li>
          <li>
            <SocialIcon network="instagram" url="https://www.instagram.com/vacationhomesforrent" target="_blank" rel="noopener"/>
          </li>
        </ul>
        <div className="space-top-2 copy-txt text-muted text-center">
          © 2018 Vacation.Rentals | All rights reserved. |
              <a href="/legal/terms-of-service" className="text-muted">
            Terms of Service  | 					</a>
          <a href="/legal/privacy-policy" className="text-muted">
            Privacy Policy  | 					</a>
          <a href="/legal/copyright-policy" className="text-muted">
            Copyright Policy 					</a>
        </div>
      </div>
    </footer>
  </div>
)
