const formatTime = (time) => {
	if (time) {
		return `${Math.floor(time / 60)}:${Math.floor(time % 60)}`;
	}
	return '00:00';
};

export default {
	formatTime,
};
