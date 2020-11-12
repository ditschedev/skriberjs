import axios from 'axios';
import Connection from "./Connection";

export default class Skriber {

  constructor(appID, publicKey, opt = {}) {
    this.settings = Object.assign({
      auth: {
        endpoint: '/push/auth',
        headers: {}
      },
      ws: 'ws://api.skriber.co:7474'
    }, opt);
    this.session = null;
    this.appID = appID;
    this.connection = new Connection({
      url: this.settings.ws,
      realm: 'default',
      onchallenge: (session, method, extra) => {
        if (method === 'token') {
          return publicKey;
        }
      },
      authmethods: ['token']
    });
    this.connection.open();
  }

  subscribe(channel, callback) {
    this.connection.getSession().then((session) => {
      channel = this.appID + '_' + channel;
      session.subscribe(channel, callback);
    });
  }

  subscribePrivate(channel, callback) {
    this.connection.getSession().then((session) => {
      axios.post(this.settings.auth.endpoint, {
        channel: channel + '.private',
        sessionID: session.id
      }, {
        headers: this.settings.auth.headers
      }).then(() => {
        channel = this.appID + '_' + channel + '.private';
        session.subscribe(channel, callback);
      }).catch(() => {
        console.warn("Skriber: Not allowed to subscribe to channel \"" + channel + "\"");
      });
    });
  }

  disconnect() {
    this.connection.close();
  }

};
