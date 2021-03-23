import React from "react";
import tree from "./tree";

export default {
    title: "tree"
};

export const WithBar = () => <tree foo="bar" />;

export const WithBaz = () => <tree foo="baz" />;
