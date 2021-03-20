// Generated with script/create-component.js
import React from "react";
import { render } from "@testing-library/react";

import widget from "./widget";
import { widgetProps } from "./widget.types";

describe("Test Component", () => {
  let props: widgetProps;

  beforeEach(() => {
    props = {
      foo: "bar"
    };
  });

  const renderComponent = () => render(<widget {...props} />);

  it("should render foo text correctly", () => {
    props.foo = "harvey was here";
    const { getByTestId } = renderComponent();

    const component = getByTestId("widget");

    expect(component).toHaveTextContent("harvey was here");
  });
});
