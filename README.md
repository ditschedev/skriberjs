## Skriber JS Client
This client can be used to subscribe to public/private channels registered in the backend application. 

### Installation
The project is accessible over yarn:
```yarn
yarn add skriberjs
```

### Initialisation
```javascript
import Skriber from 'Skriber'

let pusher = new Skriber(appID, publicKey);
```

#### Options
To configure the client, you can pass in a configuration object. Here is a list of all options and their usage/default values.
`auth.endpoint` Used to determin the endpoint, where authentication requests for private channels are sent. Default is `/push/auth`.
`auth.headers` An object used to inject headers to the authentication request. Default is `{}`.

#### Sample for changing the auth endpoint with JWT authentication:
```javascript
let client = new Skriber(appID, publicKey, {
    auth: {
      endpoint: 'http://localhost:8080/push/auth',
      headers: {
        'Authorization': 'Bearer ' + jwt
      }
    }
  });
````

### Subscribing to channels

#### Public channels
After initiating the Skriber client, you can use the instances `subscribe` function to subscribe to channels. The following script connects to the channel `channel.name` and logs the payload, if something is pushed to the channel.
```javascript
	client.subscribe('channel.name', (payload) => {
		console.log(payload);
	});
```

#### Private channels
You can have private channels aswell. Before the user can subscribe to the desired channel, he must be pre-authenticated. Meaning that the client sends a request to the backend, asking if the current user with the current session id shall be allowed to access the desired channel. The usage is equivalent to the public subscription.
```javascript
	client.subscribePrivate('channel.name', (payload) => {
		console.log(payload);
	});
```