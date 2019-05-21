import React from 'react';
import styled from 'styled-components';
import SimControls from './sim-controls/SimControls'
import Bridge from './bridge/Bridge'
//import './App.css';

const Main = styled.div`
  display: flex;
  min-width: 100vw;
  min-height: 100vh;

  .sim {
    flex: 1;
    background-color: lightsteelblue;
  }

  .bridge {
    flex: 3;
    background-color: lightyellow;
  }
`

function App() {
  return (
    <Main class='main'>
      <div class='sim'>
        <SimControls class='sim'></SimControls>
      </div>
      <div class='bridge'>
        <Bridge class='bridge'></Bridge>
      </div>
    </Main>
  );
}

export default App;
