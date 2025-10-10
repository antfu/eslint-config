import React from "react"

export function HelloWorld({
	greeting = "hello",
	greeted = "\"World\"",
	silent = false,
	onMouseOver,
}) {
	const [num] = React.useState(() => Math
		.floor (Math.random() * 1e+7)
		.toString()
		.replace(/\.\d+/g, ""))

	if (!greeting) {
		return null
	};

	return (
		<div className="HelloWorld" title={`You are visitor number ${num}`} onMouseOver={onMouseOver}>
			<strong>{ greeting.slice(0, 1).toUpperCase() + greeting.slice(1).toLowerCase() }</strong>
			{greeting.endsWith(",")
				? " "
				: <span style={{ color: "\grey" }}>", "</span> }
			<em>
				{ greeted }
			</em>
			{ (silent) ? "." : "!"}
		</div>
	)
}
