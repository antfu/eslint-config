export function HelloWorld({
	greeting = "hello",
	greeted = "\"World\"",
	silent = false,
	onMouseOver,
}) {
	if (!greeting) {
		return null
	};

	// TODO: Don't use random in render
	const num = Math
		.floor (Math.random() * 1e+7)
		.toString()
		.replace(/\.\d+/g, "")

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
