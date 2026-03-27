import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: small dot + ring.
 * Ring scales slightly on interactive elements.
 * Only on pointer:fine devices, disabled for reduced-motion.
 * Cursor is always positioned at pointer — no origin teleport.
 */
const CustomCursor = () => {
  return null; // Disabled in favor of blue CSS SVG cursor
};

export default CustomCursor;
