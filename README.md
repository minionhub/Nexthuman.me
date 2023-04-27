This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Architecture

### Redux & Firebase
Application uses Firestore accessed in React Redux store.
Available actions for React Redux are used to access the store https://react-redux.js.org/api/hooks

Usage example:

### Store
```
const createEvent = data => {
	return async (dispatch, getState, getFirestore) => {
		const firestore = getFirestore();
		const id = uuidv4();
		await firestore.set(
			{
				collection: "events",
				doc: id,
			},
			data
		);
	};
};
```
### Component
```
    import { useDispatch, useSelector } from 'react-redux';

    export default (props) => {
        // updating data
        const dispatch = useDispatch();
        const createEvent = data => dispatch(events.createEvent(data));

        // Getting data
        useFirestoreConnect(['events']);
        const eventsList = useSelector(state => state.firestore.data.events);
    };
``` 
