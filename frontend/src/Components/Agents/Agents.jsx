import React, { useState } from "react";
import Agent from "./Agent";
import agents from "../../Data/AgentsData";

export default function Agents() {
	const [allAgents] = useState(agents);

	return (
		<div className="agents" id="agents">
			<div className="agents-intro">
				<p className="agents-heading">Meet Our Agents</p>
				<p className="agents-text">
					Meet our agents that help you find you new Happy Place.
				</p>
			</div>
			<div className="agents-container">
				{allAgents.map((agent) => (
					<Agent
						key={agent.id}
						name={agent.name}
						title={agent.title}
						image={agent.image}
					/>
				))}
			</div>
		</div>
	);
}
