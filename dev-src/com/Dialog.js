let qtipBox;
export default {
	qtip(msg, type, options) {
		if(!qtipBox) {
			qtipBox = document.createElement('div');
			qtipBox.className = 'st-qtip-box';
			document.body.appendChild(qtipBox);
		}
		
	}
};