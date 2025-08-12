import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Extensions from "./Extensions";

describe("Extensions", () => {
  it("renders the extensions menu", () => {
    const extensions = {
      ext1: { extensionName: "Ext1" },
      ext2: { extensionName: "Ext2" },
    };
    render(<Extensions extensions={extensions} onLinkClick={() => {}} />);
    expect(screen.getByLabelText("Extensions")).toBeInTheDocument();
  });
});
