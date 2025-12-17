import React, { useState, useRef, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/modules/popover";
import { Button } from "@/components/modules/button";
import { TimerIcon } from "lucide-react";

/**
 * Fixed Material-like Analog TimePicker
 * Fixes:
 * - Hour hand draggable (detect nearest hand on pointerdown)
 * - Proper pointer capture/release so drag never locks
 * - Same math for hand tip positions as for rendering so no positional drift
 * - Both mouse and touch (Pointer Events)
 */

// ---------- math helpers ----------
function getAngleFromCenter(cx, cy, x, y) {
  const dx = x - cx;
  const dy = y - cy;
  let deg = Math.atan2(dy, dx) * (180 / Math.PI);
  deg = deg + 90; // 0° at 12 o'clock
  return deg < 0 ? deg + 360 : deg;
}

function angleToMinute(angle) {
  return Math.round(angle / 6) % 60;
}

function angleToHour(angle) {
  // return 1..12
  const h = Math.round(angle / 30) % 12;
  return h === 0 ? 12 : h;
}

function degToRad(d) {
  return (d - 90) * (Math.PI / 180);
}

// ---------- presentational pieces ----------
function ClockFace({ size = 280, children }) {
  return (
    <div
      className="relative rounded-full border bg-background"
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  );
}

function Numbers({ size }) {
  const r = size / 2;
  return Array.from({ length: 12 }).map((_, i) => {
    const value = i + 1;
    const angle = value * 30;
    const rad = ((angle - 90) * Math.PI) / 180;
    const dist = r * 0.78;
    return (
      <div
        key={value}
        className="absolute text-sm font-medium select-none pointer-events-none"
        style={{
          left: r + Math.cos(rad) * dist,
          top: r + Math.sin(rad) * dist,
          transform: "translate(-50%, -50%)",
        }}
      >
        {value}
      </div>
    );
  });
}

function MinuteDots({ size }) {
  const r = size / 2;
  return Array.from({ length: 60 }).map((_, i) => {
    const angle = i * 6;
    const rad = ((angle - 90) * Math.PI) / 180;
    const dist = r * 0.9;
    const big = i % 5 === 0;
    return (
      <div
        key={i}
        className="absolute rounded-full bg-foreground/60 pointer-events-none"
        style={{
          width: big ? 4 : 2,
          height: big ? 4 : 2,
          left: r + Math.cos(rad) * dist,
          top: r + Math.sin(rad) * dist,
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  });
}

function Hand({ angle, length, width, color }) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width,
        height: length,
        background: color,
        transform: `translate(-50%, -100%) rotate(${angle}deg)`,
        transformOrigin: "50% 100%",
        borderRadius: 999,
      }}
    />
  );
}

// ---------- main component ----------
export default function TimePicker({
  initialHour = 12,
  initialMinute = 0,
  onChange,
  onClose,
} = {}) {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [mode, setMode] = useState("hour"); // hour | minute
  const [open, setOpen] = useState(false);

  const ref = useRef(null);
  const dragging = useRef(null); // 'hour' | 'minute' | null
  const size = 280;

  useEffect(() => {
    if (typeof onChange === "function") onChange({ hour, minute });
  }, [hour, minute, onChange]);

  const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0"
  )}`;

  function computeHandTips(rect, hourVal, minuteVal) {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radius = rect.width / 2;
    const hourLen = radius * 0.32;
    const minuteLen = radius * 0.42;

    const hourRotation = ((hourVal % 12) + minuteVal / 60) * 30; // degrees
    const minuteRotation = minuteVal * 6; // degrees

    const hourRad = degToRad(hourRotation);
    const minuteRad = degToRad(minuteRotation);

    const hourTip = {
      x: cx + Math.cos(hourRad) * hourLen,
      y: cy + Math.sin(hourRad) * hourLen,
    };
    const minuteTip = {
      x: cx + Math.cos(minuteRad) * minuteLen,
      y: cy + Math.sin(minuteRad) * minuteLen,
    };

    return { hourTip, minuteTip, cx, cy, radius };
  }

  function onPointerDown(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const { hourTip, minuteTip, cx, cy, radius } = computeHandTips(
      rect,
      hour,
      minute
    );

    const x = e.clientX;
    const y = e.clientY;

    const distHour = Math.hypot(x - hourTip.x, y - hourTip.y);
    const distMinute = Math.hypot(x - minuteTip.x, y - minuteTip.y);

    // threshold for selecting a hand
    const THRESH = Math.max(18, radius * 0.18);

    if (distHour < distMinute && distHour < THRESH) {
      dragging.current = "hour";
      setMode("hour");
    } else if (distMinute < THRESH) {
      dragging.current = "minute";
      setMode("minute");
    } else {
      // click on face: set minute directly, do not start dragging
      const angle = getAngleFromCenter(cx, cy, x, y);
      setMinute(angleToMinute(angle));
      dragging.current = null;
    }

    // pointer capture
    try {
      ref.current.setPointerCapture(e.pointerId);
    } catch (err) {
      // ignore
    }

    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!ref.current) return;
    if (!dragging.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const angle = getAngleFromCenter(cx, cy, e.clientX, e.clientY);

    if (dragging.current === "minute") {
      const newMin = angleToMinute(angle);
      setMinute((prev) => (prev === newMin ? prev : newMin));
    } else if (dragging.current === "hour") {
      const newHour = angleToHour(angle);
      setHour((prev) => (prev === newHour ? prev : newHour));
    }
  }

  function onPointerUp(e) {
    if (!ref.current) return;
    try {
      ref.current.releasePointerCapture(e.pointerId);
    } catch (err) {
      // ignore
    }
    dragging.current = null;
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next && typeof onClose === "function") {
          onClose({ hour, minute });
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" className="!p-0">
          <TimerIcon className="!w-4 !h-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-4 w-auto">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2 text-lg font-semibold">
            <Button
              className={mode === "minute" ? "text-primary" : "opacity-60"}
              onClick={() => setMode("minute")}
              variant="ghost"
            >
              {String(minute).padStart(2, "0")}
            </Button>
            <span>:</span>
            <Button
              className={mode === "hour" ? "text-primary" : "opacity-60"}
              onClick={() => setMode("hour")}
              variant="ghost"
            >
              {String(hour).padStart(2, "0")}
            </Button>
          </div>

          <div
            ref={ref}
            className="touch-none select-none"
            style={{ touchAction: "none" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            role="application"
            aria-label="Analog time picker"
          >
            <ClockFace size={size}>
              <MinuteDots size={size} />
              <Numbers size={size} />

              <Hand
                angle={((hour % 12) + minute / 60) * 30}
                length={`${size * 0.32}px`}
                width={6}
                color="currentColor"
              />
              <Hand
                angle={minute * 6}
                length={`${size * 0.42}px`}
                width={5}
                color="var(--primary)"
              />

              <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            </ClockFace>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
