# libsso

`libsso` is a lightweight React hook designed to facilitate communication between an SSO (Single Sign-On) provider's frontend and an SSO consumer. The workflow is straightforward:

### 1. Domain Registration & JWT Token

The SSO consumer must first register its domain to be whitelisted by the SSO provider. The provider then issues a JWT secret key to the consumer. Whenever the consumer initiates a login or signup request, it generates and attaches a JWT token to authenticate its identity.

### 2. Embedding the SSO Provider's Domain

`libsso` embeds an iframe pointing to the SSO provider's domain URL, including a search parameter containing the JWT token. Once the iframe loads, `libsso` automatically sends a postMessage to the iframe, querying the provider domain for an existing login session.

### 3. JWT Validation by the SSO Provider

The SSO provider checks for the JWT token in its URL. If the token is present, the provider verifies it with the backend to validate the consumer’s identity, including its project ID and registered origin.

### 4. Handling the PostMessage Event

If the JWT token is valid, the SSO provider's frontend starts listening for the `"message"` event on the `window` object. Upon receiving a message, the provider compares the event origin with the registered project origin. If the origin is valid, it sends a postMessage back to the iframe's parent, indicating whether there is an active session.

- If an active session is found, the message contains the user's public information.
- If no session exists, the message prompts the consumer to initiate a login.

### 5. Handling the Response in libsso

Upon receiving a message from the provider, `libsso` offers two options:

- If a session is active, `libsso` returns the user data to the consumer, allowing them to display the logged-in user's information. It also provides a function to continue using the current session.
- If no session is found, `libsso` generates a login link with the JWT token attached, enabling the provider to correctly redirect the user for authentication.

### 6. User Login & Redirection

Once the user chooses to connect or log in, the SSO provider issues a new JWT using the project's key and redirects to the registered success URL. The consumer project should then verify the token with its key, create a new user or log in an existing user, and finally redirect the user to the consumer domain with the session information for storage.

## Usage

Install the node module.

```sh
npm i koompi/libsso
```

Create SSO component

```jsx
function SSO({
	projectToken,
	onSuccess,
}: {
	projectToken: string,
	onSuccess: (token: string) => void,
}) {
	// Initialize the SSO hook with the provided projectToken and onSuccess callback.
	const { Detector, LoadingSSO, ConnectDetectedAccount, LoginWithSSO } = useSSO(
		{
			onSucess: onSuccess, // Callback for when the login is successful
			projectToken, // JWT token used for authentication
		}
	);

	return (
		<>
			{/* The Detector component must be included to initialize the SSO iframe communication */}
			<Detector />

			<LoadingSSO>
				{/* Displayed while the SSO is checking the user's login status */}
				Loading...
			</LoadingSSO>

			<ConnectDetectedAccount>
				{/* If a session is detected, display the account information and a connect button */}
				{(account, connect) => (
					<>
						<pre>{JSON.stringify(account(), null, 4)}</pre>
						{/* Call the connect function to continue the session */}
						<button onClick={connect}>Connect</button>
					</>
				)}
			</ConnectDetectedAccount>

			<LoginWithSSO>
				{/* If no session is detected, provide a button to redirect to the SSO login page */}
				{(handler) => <button onClick={handler}>Login</button>}
			</LoginWithSSO>
		</>
	);
}
```

Use the SSO compoent

```jsx
function App() {
	// State to hold the project identity token
	const [token, setToken] = useState("");
	// State to manage client authorization using local storage
	const [authToken, setAuthToken, deleteToken] = useLocalStorage(
		"access_token", // Key used in local storage
		"" // Initial value
	);

	useEffect(() => {
		// If the user is not logged in and a project token has not yet been obtained
		if (authToken === "" && !token) {
			(async () => {
				// Fetch the project token from the backend
				const req = await fetch("http://localhost:3003/issue-token", {
					method: "POST",
				});
				const res = await req.json();
				setToken(res.token); // Store the fetched token in state
			})();
		}
	}, [authToken, token]);

	return (
		<>
			{/* If the user is not logged in but the project token is available, display the SSO component */}
			{!authToken && token && (
				<SSO
					projectToken={token}
					// Handle what to do after successful login
					onSuccess={(_token) => {
						setAuthToken(_token); // Save the auth token
						window.location.replace("/"); // Redirect to the home page
					}}
				/>
			)}

			{/* If the user is logged in, provide a log out button */}
			{authToken && <button onClick={deleteToken}>Log Out</button>}
		</>
	);
}
```
