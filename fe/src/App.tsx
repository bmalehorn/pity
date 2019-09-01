import React from "react";
import "./App.css";
import { Terminal } from "xterm";
import { attach } from "xterm/lib/addons/attach/attach";
// import { fit } from "xterm/lib/addons/fit/fit";

class App extends React.Component {
  termRef: HTMLElement | null = null;

  componentDidMount() {
    if (!this.termRef) {
      return;
    }

    const term = new Terminal();
    // Terminal.applyAddon(attach); // Apply the `attach` addon
    // No idea what this does
    // term.winptyCompatInit();
    // This kinda makes sense
    term.open(this.termRef);
    // Open the websocket connection to the backend
    const socketUrl = `ws://localhost:2589/shell`;
    const socket = new WebSocket(socketUrl);
    socket.onopen = _ev => {
      attach(term, socket, true, true);
    };
  }

  render() {
    return (
      <div className="App">
        <div className="term" ref={ref => (this.termRef = ref)}></div>
      </div>
    );
  }
}

export default App;
