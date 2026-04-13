import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Hello world</Card>);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("applies solid variant by default", () => {
    render(<Card>Content</Card>);
    const card = screen.getByText("Content").closest("div")!;
    expect(card.className).toContain("bg-white");
    expect(card.className).toContain("shadow-sm");
    expect(card.className).toContain("border-gray-100");
  });

  it("applies glass variant styles", () => {
    render(<Card variant="glass">Glass</Card>);
    const card = screen.getByText("Glass").closest("div")!;
    expect(card.className).toContain("bg-white/90");
    expect(card.className).toContain("backdrop-blur-xl");
    expect(card.className).toContain("shadow-2xl");
  });

  it("applies sm padding", () => {
    render(<Card padding="sm">Small</Card>);
    const card = screen.getByText("Small").closest("div")!;
    expect(card.className).toContain("p-4");
  });

  it("applies md padding", () => {
    render(<Card padding="md">Medium</Card>);
    const card = screen.getByText("Medium").closest("div")!;
    expect(card.className).toContain("p-6");
  });

  it("applies lg padding by default", () => {
    render(<Card>Large</Card>);
    const card = screen.getByText("Large").closest("div")!;
    expect(card.className).toContain("p-8");
  });

  it("passes className through", () => {
    render(<Card className="custom-class">Styled</Card>);
    const card = screen.getByText("Styled").closest("div")!;
    expect(card).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Card ref={ref}>Ref test</Card>);
    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
  });
});
