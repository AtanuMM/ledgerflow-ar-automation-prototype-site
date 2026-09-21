import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

function ActionMenu({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
  buttonClassName = "btn-ghost !p-2",
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const toggleMenu = (event) => {
    event.stopPropagation();
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const showAbove = window.innerHeight - rect.bottom < 120;
      setPosition({
        top: showAbove ? rect.top - 96 : rect.bottom + 6,
        left: Math.max(8, rect.right - 152),
      });
    }
    setOpen((value) => !value);
  };

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const closeMenu = () => setOpen(false);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("scroll", closeMenu, true);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, [open]);

  const runAction = (action) => (event) => {
    event.stopPropagation();
    setOpen(false);
    action?.();
  };

  return <>
    <button
      ref={buttonRef}
      type="button"
      aria-label="Open actions"
      aria-expanded={open}
      onClick={toggleMenu}
      className={buttonClassName}
    >
      <MoreHorizontal size={17} />
    </button>
    {open && createPortal(
      <div
        ref={menuRef}
        role="menu"
        style={{ top: position.top, left: position.left }}
        className="fixed z-[100] w-36 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10"
      >
        <button role="menuitem" onClick={runAction(onEdit)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <Pencil size={15} />{editLabel}
        </button>
        <button role="menuitem" onClick={runAction(onDelete)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50">
          <Trash2 size={15} />{deleteLabel}
        </button>
      </div>,
      document.body,
    )}
  </>;
}

export default ActionMenu;
