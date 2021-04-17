import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";

import { LightProbe } from "./LightProbe";
import { Bulb } from "./Bulb";
import { SolarSystem } from "./SolarSystem";

export const ProbeRoutes: React.FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/probe`}>
        <LightProbe />
      </Route>
      <Route path={`${path}/bulb`}>
        <Bulb />
      </Route>
      <Route path={`${path}/solar`}>
        <SolarSystem />
      </Route>
    </Switch>
  );
};
