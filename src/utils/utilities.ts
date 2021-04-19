import React from "react";

export const isRef = <T>(ref: any): ref is React.MutableRefObject<T> => {
  return Object.prototype.hasOwnProperty.call(ref, "current");
};
