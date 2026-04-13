import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not fire onClick when disabled", async () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Click</Button>);

    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders icon alongside children", () => {
    render(<Button icon={<span data-testid="icon">★</span>}>Star</Button>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText("Star")).toBeInTheDocument();
  });

  it("applies pill class when pill prop is true", () => {
    render(<Button pill>Pill</Button>);
    expect(screen.getByRole("button")).toHaveClass("rounded-full");
  });

  it("applies fullWidth class", () => {
    render(<Button fullWidth>Wide</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  it("applies secondary variant styles", () => {
    render(<Button variant="secondary">Save</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-[#0D3B66]");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref).toHaveBeenCalled();
  });
});
