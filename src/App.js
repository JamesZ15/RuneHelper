import styled from 'styled-components';
import * as Tone from 'tone';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useRouteMatch,
  useNavigate
} from "react-router-dom";

import logo from './logo.svg';
import './App.css';

window.api.receive("fromMain", (data) => {
  console.log(`Received ${data} from main process`);
});
// window.api.send("toMain", "some data");

const MainPageContainer = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  overflow: hidden;
  border: 1px solid pink;
`;
// height: 100vh
// background: rgb(0,0,0);
// background: linear-gradient(28deg, rgba(0,0,0,1) 0%, rgba(7,0,25,1) 7%, rgba(16,0,56,1) 20%, rgba(25,0,85,1) 33%, rgba(36,0,120,1) 47%, rgba(44,0,147,1) 62%, rgba(51,0,169,1) 72%, rgba(62,0,206,0.7287115529805672) 100%);
// box-shadow: inset 0px 0px 16px 11px rgba(0,0,0,0.4);


const FrameReplacement = styled.div`
  width: 100%;
  height: 32px;
  background-color: #000;
  top: 0;
  left: 0;
  position: absolute;
  webkit-app-region: drag;
`;

const InfoFrame = styled.div`
  position: absolute;
  width: 100%;
  top: 64px;
  left: 0px;
  background-color: white;
`;


function App() {
  return (
    <MainPageContainer>
      <FrameReplacement></FrameReplacement>
      <InfoFrame>Test</InfoFrame>
      </MainPageContainer>
  );
}

export default App;

