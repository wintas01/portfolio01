import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";

import { LANGUAGES, useI18n, type LanguageCode } from "@/i18n";

export default function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const { language, setLanguage, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  const current = LANGUAGES.find((entry) => entry.code === language);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointer);
    return () => document.removeEventListener("pointerdown", handlePointer);
  }, [open]);

  // Move focus to the highlighted option while the menu is open.
  useEffect(() => {
    if (open) itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  const openMenu = () => {
    const selected = LANGUAGES.findIndex((entry) => entry.code === language);
    setActiveIndex(selected < 0 ? 0 : selected);
    setOpen(true);
  };

  const choose = (code: LanguageCode) => {
    setLanguage(code);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleMenuKeyDown = (event: KeyboardEvent) => {
    const last = LANGUAGES.length - 1;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index >= last ? 0 : index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? last : index - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(last);
    } else if (event.key === "Escape" || event.key === "Tab") {
      if (event.key === "Escape") {
        event.preventDefault();
        buttonRef.current?.focus();
      }
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${t.language.label}: ${current?.label ?? "English"}`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openMenu();
          }
        }}
        className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-foreground bg-background px-3.5 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{current?.label}</span>
        <span className="uppercase sm:hidden">{language}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label={t.language.label}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            onKeyDown={handleMenuKeyDown}
            className="absolute right-0 top-full z-50 mt-2 w-48 origin-top-right rounded-2xl border border-border bg-card p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.14)]"
          >
            {LANGUAGES.map((entry, index) => {
              const selected = entry.code === language;
              return (
                <button
                  key={entry.code}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  lang={entry.code}
                  tabIndex={index === activeIndex ? 0 : -1}
                  onClick={() => choose(entry.code)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold outline-none transition-colors focus-visible:bg-muted ${
                    selected ? "bg-muted text-foreground" : "text-foreground/80 hover:bg-muted"
                  }`}
                >
                  {entry.label}
                  {selected && <Check className="h-4 w-4" aria-hidden="true" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
