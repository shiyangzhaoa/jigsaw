import React from "react";
import { render } from "@testing-library/react";

import tree from "./tree";
import { treeProps } from "./tree.types";

describe("Test Component", () => {
  let props: treeProps;

  beforeEach(() => {
    props = {
      foo: "bar"
    };
  });

  const renderComponent = () => render(<tree {...props} />);

  it("should render foo text correctly", () => {
    props.foo = "harvey was here";
    const { getByTestId } = renderComponent();

    const component = getByTestId("tree");

    expect(component).toHaveTextContent("harvey was here");
  });
});
