import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog, useConfirmDialog } from "./ConfirmDialog";

const defaultProps = {
  isOpen: true,
  title: "ยืนยัน",
  message: "ต้องการลบรายการนี้?",
  onConfirm: vi.fn(),
  onClose: vi.fn(),
};

describe("ConfirmDialog", () => {
  it("renders nothing when isOpen is false", () => {
    const { container } = render(
      <ConfirmDialog {...defaultProps} isOpen={false} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders title and message when open", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByRole("heading", { name: "ยืนยัน" })).toBeInTheDocument();
    expect(screen.getByText("ต้องการลบรายการนี้?")).toBeInTheDocument();
  });

  it("calls onConfirm and onClose when confirm button clicked", async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} onClose={onClose} />);

    await userEvent.click(screen.getByRole("button", { name: "ยืนยัน" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when cancel button clicked", async () => {
    const onClose = vi.fn();
    render(<ConfirmDialog {...defaultProps} onClose={onClose} />);

    await userEvent.click(screen.getByRole("button", { name: "ยกเลิก" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("has proper aria attributes", () => {
    render(<ConfirmDialog {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "confirm-dialog-title");
  });

  it("uses custom button labels", () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        confirmLabel="ลบเลย"
        cancelLabel="ไม่ลบ"
      />,
    );
    expect(screen.getByRole("button", { name: "ลบเลย" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ไม่ลบ" })).toBeInTheDocument();
  });

  it("handles async onConfirm without throwing", async () => {
    const asyncConfirm = vi.fn(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });
    const onClose = vi.fn();
    render(
      <ConfirmDialog {...defaultProps} onConfirm={asyncConfirm} onClose={onClose} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "ยืนยัน" }));
    expect(asyncConfirm).toHaveBeenCalled();
  });

  it("calls onClose when backdrop is clicked", async () => {
    const onClose = vi.fn();
    const { container } = render(
      <ConfirmDialog {...defaultProps} onClose={onClose} />,
    );

    const backdrop = container.querySelector(".bg-black\\/40") as HTMLElement;
    expect(backdrop).toBeTruthy();
    await userEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(<ConfirmDialog {...defaultProps} onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose even when onConfirm throws synchronously", async () => {
    const throwingConfirm = vi.fn(() => {
      throw new Error("sync boom");
    });
    const onClose = vi.fn();
    render(
      <ConfirmDialog {...defaultProps} onConfirm={throwingConfirm} onClose={onClose} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "ยืนยัน" }));
    expect(throwingConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose after async onConfirm completes", async () => {
    const onClose = vi.fn();
    const asyncConfirm = vi.fn(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });
    render(
      <ConfirmDialog {...defaultProps} onConfirm={asyncConfirm} onClose={onClose} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "ยืนยัน" }));
    expect(asyncConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("useConfirmDialog", () => {
  it("showConfirm opens dialog state", () => {
    const { result } = renderHook(() => useConfirmDialog());

    expect(result.current.dialog.isOpen).toBe(false);

    act(() => {
      result.current.showConfirm({
        title: "Test",
        message: "Are you sure?",
        onConfirm: () => {},
      });
    });

    expect(result.current.dialog.isOpen).toBe(true);
    expect(result.current.dialog.title).toBe("Test");
    expect(result.current.dialog.message).toBe("Are you sure?");
  });

  it("closeDialog resets state", () => {
    const { result } = renderHook(() => useConfirmDialog());

    act(() => {
      result.current.showConfirm({
        title: "Test",
        message: "Are you sure?",
        onConfirm: () => {},
      });
    });

    expect(result.current.dialog.isOpen).toBe(true);

    act(() => {
      result.current.closeDialog();
    });

    expect(result.current.dialog.isOpen).toBe(false);
    expect(result.current.dialog.title).toBe("");
    expect(result.current.dialog.message).toBe("");
  });
});
