import React from "react";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import Suzanne from "./Suzanne";
import { BasicObjects } from "./BasicObjects";
import { CustomBuffer } from "./CustomBuffer";

export const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/suzanne">
          <Suzanne />
        </Route>
        <Route path="/basic-objects">
          <BasicObjects />
        </Route>
        <Route path="/custom-buffer">
          <CustomBuffer />
        </Route>
        <Route exact path="/">
          <ul>
            <li>
              <Link to="/suzanne">Suzanne</Link>
            </li>
            <li>
              <Link to="/basic-objects">Basic Objects</Link>
            </li>
            <li>
              <Link to="/custom-buffer">Custom Buffer</Link>
            </li>
          </ul>
        </Route>
      </Switch>
    </Router>
  );
};
