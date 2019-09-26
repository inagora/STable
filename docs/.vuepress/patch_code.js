module.exports = (options, ctx) => {
	return {
		updated (pagePaths) {
			console.log(pagePaths);
			console.log(ctx)
			// ...
		},
		async generated (pagePaths) {
			console.log(pagePaths)
			// ...
		}
	}
}