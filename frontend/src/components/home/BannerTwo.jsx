import React from 'react';
import { Link } from 'react-router-dom';
import { Masks } from 'components';
import 'assets/styles/home/banner.scss';

const styles = {
	bgimage: {
		backgroundImage: "url('https://res.cloudinary.com/vacation-rentals/image/upload/v1574336358/images/vacation_2_cropped.webp')",
		backgroundRepeat: "no-repeat",
		backgroundAttachment: "scroll",
		backgroundPositionX: "center",
		backgroundPositionY: "75%",
		backgroundSize: "cover"
	},

	bgoverlay: {
		backgroundColor: "rgba(0,0,0,0.25)"
	}
}

const BannerTwo = props => (
	<section className="communicate">
		<div className="full_width">
			<div className="row">
				<div className="col-md-12 col-sm-12">
					<div className="communicate-container">
						<div className="kl-bg-source">
							<div className="kl-bg-source__bgimage" style={styles.bgimage} alt="Image"></div>
							<div className="kl-bg-source__overlay" style={styles.bgoverlay} alt="Image"></div>
							<div className="kl-bg-source__overlay-gloss"></div>
						</div>
						<div className="communicate-container-content">
							<div className="row">
								<div className="borderanim2-svg text-center mx-auto">
									<svg height="140" width="140" xmlns="http://www.w3.org/2000/svg">
										<rect className="borderanim2-svg__shape" x="0" y="0" height="140" width="140"></rect>
									</svg>
									<span className="borderanim2-svg__text">
										<Link to="#" className="signup_popup_head2" title="Register">
                      <img src="https://res.cloudinary.com/vacation-rentals/image/upload/v1553980443/images/vr-icon-white.webp" 
                        className="communicate-container-icon" alt="Vacation Rentals" />
										</Link>
									</span>
								</div>
							</div>
							<div className="row">
								<div className="col-10 col-md-12 float-none mx-auto">
									<div className="text-center pt-1 pt-md-4">
										<h2 className="tok-title fs-xs-xl fs-l fw-bold">
											Communicate directly with each other <span className="tok-title-ext">BEFORE</span> the reservation is made.
										</h2>
										<p className="tok-desc">
											<span className="d-block fs-xs-md fs-22">We think of ourselves as "The Vacation Matchmaker!"</span>
											<span className="d-block mt-1 fs-xs-small fs-18">We just make the introductions and leave the rest to you - the homeowner and  traveler.</span>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
    <Masks mode={3} svg_class='svgmask-left'/>
	</section>
)

export default BannerTwo;