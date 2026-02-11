import React from "react";
import landingImage from "../../img/landing.jpg";

export default function Header() {
	return (
		<div className="header" id="header">
			<div className="header-left">
				<div className="landing-text">
					<div className="cta">
						<p>Find Your New Modern Apartment</p>
					</div>
				</div>
			</div>

			<div className="header-right">
				<div className="landing-image">
					<img src={landingImage} alt="Landing" />
				</div>
				<div className="contact-info">
					<div className="phone">
						<p>
							<i className="fa fa-phone" aria-hidden="true"></i>{" "}
							<span>(+91) 9986542541</span>
						</p>
					</div>
					<div>
						<p>
							<i className="fa fa-map-marker" aria-hidden="true"></i>{" "}
							<span>Gujarat, India</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
