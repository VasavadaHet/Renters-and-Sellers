export default function About() {
	return (
		<div className="about" id="about">
			<div className="company">
				<p className="heading">Our Company's Statistics</p>
				<p>
				Welcome to Renters and Sellers, your trusted partner in the real estate journey.
				Whether you're looking to rent, sell, or buy a property, we bring together smart technology, expert insights, and user-friendly tools to help you make the best decisions.
				</p>
				<br />
				<p>
					{" "}
					At Renters and Sellers, we believe in empowering you with the right data at the right time — making your real estate experience smarter, faster, and more transparent.

Explore the market with confidence.
Find your place, your future, your home — with Renters and Sellers
				</p>
			</div>
			<div className="stats">
				<div className="apartments">
					<p>
						<span>784</span> <br /> Apartments
					</p>
				</div>
				<div className="clients">
					<p>
						<span>3854</span>
						<br /> Clients
					</p>
				</div>
				<div className="employees">
					<p>
						<span>24</span>
						<br /> Employees
					</p>
				</div>
				<div className="awards">
					<p>
						<span>14</span>
						<br /> Awards
					</p>
				</div>
			</div>
		</div>
	);
}
