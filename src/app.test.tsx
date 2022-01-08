import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "./app";

test("renders learn react link", () => {
  render(React.createElement(App));
  const rowLabel = screen.getByText(/Row Count/i);
  const columnLabel = screen.getByText(/Column Count/i);
  expect(rowLabel).toBeInTheDocument();
  expect(columnLabel).toBeInTheDocument();
});
