import React, {useEffect, useState} from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';

export default ({ value, minDate, minDateMessage, maxDate, maxDateMessage, onChange, ...props } = {}) => {
	const [error, setError] = useState(null);

	const checkError = (val = value) => {
		if (minDate && val.isBefore(minDate)) {
			return setError(minDateMessage || 'Date should not be after maximal date');
		}
		if (maxDate && maxDate.isBefore(val)) {
			return setError(maxDateMessage || 'Date should not be before minimal date');
		}
		setError(null);
	};

	const handleChange = (val) => {
		checkError(val);
		onChange && onChange(val);
	};

	useEffect(() => {
		checkError(value);
	}, [value, minDate, minDateMessage, maxDate, maxDateMessage]);

	return (<KeyboardDatePicker
		autoOk
		error={!!error}
		helperText={error}
		variant="inline"
		inputVariant="outlined"
		format="MM/dd/yyyy"
		value={value}
		InputAdornmentProps={{ position: "start" }}
		disablePast
		{...props}
		onChange={handleChange}
	/>);
};
