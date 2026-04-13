import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders label linked to input via htmlFor/id", () => {
    render(<Input label="Email" />);
    const label = screen.getByText("Email");
    const input = screen.getByRole("textbox");
    expect(label).toHaveAttribute("for", input.id);
  });

  it("shows error border when error is true", () => {
    render(<Input error />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("border-red-500");
  });

  it("toggles password visibility", async () => {
    render(<Input isPassword />);
    const passwordInput = document.querySelector("input") as HTMLInputElement;
    expect(passwordInput.type).toBe("password");

    const toggleBtn = screen.getByRole("button", { name: "แสดงรหัสผ่าน" });
    await userEvent.click(toggleBtn);
    expect(passwordInput.type).toBe("text");

    const hideBtn = screen.getByRole("button", { name: "ซ่อนรหัสผ่าน" });
    await userEvent.click(hideBtn);
    expect(passwordInput.type).toBe("password");
  });

  it("applies filled variant styles", () => {
    render(<Input variant="filled" />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("bg-gray-50");
  });

  it("passes through native input props", async () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} placeholder="Type" />);

    await userEvent.type(screen.getByPlaceholderText("Type"), "hello");
    expect(onChange).toHaveBeenCalled();
  });
});
