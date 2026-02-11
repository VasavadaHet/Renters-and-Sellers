import serviceImage from "../../img/services.jpeg";
export default function Services() {
	return (
		<div className="services">
			<div className="services-intro">
				<p className="services-heading">Services</p>
				<p className="services-text">
					Welcome to the services that we offer to our viewers and visiters
				</p>
			</div>
			<div className="services-content">
				<div className="services-img">
					<img src={serviceImage} alt="" />
				</div>
				<div className="service">
					<div>
						<p className="service-heading">Market Trends</p>
						<p className="service-text">
						"Stay informed with real-time market trends and pricing insights.
						Analyze historical data to make smarter renting or buying decisions."
						</p>
					</div>
					<div>
						<p className="service-heading">Compare Properties</p>
						<p className="service-text">
						"Effortlessly compare multiple properties side by side.
						Evaluate features, pricing, and locations to find your perfect match."
						</p>
					</div>
					<div>
						<p className="service-heading">Predict Pricing</p>
						<p className="service-text">
						"Get instant, AI-driven price predictions for any property.
						Know the fair value before you rent, buy, or sell."
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
