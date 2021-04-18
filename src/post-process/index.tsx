import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";

import { Basic } from "./Basic";

export const PostProcessRoutes: React.FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/basic`}>
        <Basic />
      </Route>
    </Switch>
  );
};
