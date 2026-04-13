import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders a textarea element", () => {
    render(<Textarea placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders label linked via htmlFor/id", () => {
    render(<Textarea label="Notes" />);
    const label = screen.getByText("Notes");
    const textarea = screen.getByRole("textbox");
    expect(label).toHaveAttribute("for", textarea.id);
  });

  it("shows error border when error is true", () => {
    render(<Textarea error />);
    const textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain("border-red-500");
  });

  it("applies filled variant styles", () => {
    render(<Textarea variant="filled" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain("bg-gray-50");
    expect(textarea.className).toContain("border-gray-200");
  });

  it("applies default variant styles by default", () => {
    render(<Textarea />);
    const textarea = screen.getByRole("textbox");
    expect(textarea.className).toContain("bg-white");
    expect(textarea.className).toContain("border-gray-300");
  });

  it("passes through native textarea props", async () => {
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} placeholder="Type here" />);

    await userEvent.type(screen.getByPlaceholderText("Type here"), "hello");
    expect(onChange).toHaveBeenCalled();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Textarea ref={ref} />);
    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLTextAreaElement);
  });
});
