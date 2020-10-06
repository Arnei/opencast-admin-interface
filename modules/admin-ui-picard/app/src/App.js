import React from 'react';
import {HashRouter, Switch, Route, Redirect} from "react-router-dom";
import './App.scss';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Events from "./components/events/Events";
import Recordings from "./components/recordings/Recordings";
import Jobs from "./components/systems/Jobs";
import Themes from "./components/configuration/Themes";
import Users from "./components/users/Users";
import Statistics from "./components/statistics/Statistics";
import Series from "./components/events/Series";
import Login from "./components/Login";

const version = {
  version: '8.03',
  buildNumber: '42'
};
const feedbackUrl = 'https://opencast.org/';


function App() {
  return (
      //todo: add remaining routes and put login on other place
          <HashRouter>
              <Header />
              <Switch>
                  <Route exact path={"/"}>
                      <Login />
                  </Route>
                  <Route exact path={"/events/events"}>
                      <Events />
                  </Route>
                  <Route exact path={"/events/series"}>
                      <Series />
                  </Route>
                  <Route exact path={"/recordings/recordings"}>
                      <Recordings />
                  </Route>
                  <Route exact path={"/systems/jobs"}>
                      <Jobs />
                  </Route>
                  <Route exact path={"/configuration/themes"}>
                      <Themes />
                  </Route>
                  <Route exact path={"/users/users"}>
                      <Users />
                  </Route>
                  <Route exact path={"/statistics/organization"}>
                      <Statistics />
                  </Route>
              </Switch>
              <Footer version={version}  feedbackUrl={feedbackUrl}/>
          </HashRouter>
  );
}

export default App;
