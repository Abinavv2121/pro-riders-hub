import { useEffect, useRef } from 'react';

/**
 * useCardParallax Hook
 * ==================
 * Adds parallax mouse-follow effect to bike images on card hover.
 * - Tracks cursor position inside the card
 * - Animates only the bike image, not the card itself
 * - Respects prefers-reduced-motion for accessibility
 * - Uses requestAnimationFrame for 60fps smooth animation
 */

interface ParallaxConfig {
  maxTranslate?: number; // Max pixels to move in X/Y (intensity)
  maxRotate?: number; // Max rotation in degrees
  easing?: number; // Smoothing factor (0–1; lower = smoother)
}

class BikeCardParallax {
  private card: HTMLElement | null;
  private image: HTMLElement | null;
  private config: Required<ParallaxConfig>;
  private isHovering = false;
  private currentX = 0;
  private currentY = 0;
  private targetX = 0;
  private targetY = 0;
  private rotateZ = 0;
  private targetRotateZ = 0;
  private prefersReducedMotion = false;
  private animationFrameId: number | null = null;

  constructor(
    cardElement: HTMLElement,
    imageElement: HTMLElement,
    config: ParallaxConfig = {}
  ) {
    this.card = cardElement;
    this.image = imageElement;
    this.config = {
      maxTranslate: config.maxTranslate ?? 15,
      maxRotate: config.maxRotate ?? 5,
      easing: config.easing ?? 0.15,
    };

    // Check if user prefers reduced motion
    this.prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    this.attachListeners();
  }

  private attachListeners = () => {
    if (!this.card) return;

    this.card.addEventListener('mouseenter', this.onMouseEnter);
    this.card.addEventListener('mousemove', this.onMouseMove);
    this.card.addEventListener('mouseleave', this.onMouseLeave);
  };

  private onMouseEnter = () => {
    this.isHovering = true;
    if (!this.prefersReducedMotion) {
      // Start animation loop
      this.animate();
    }
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isHovering || !this.card || this.prefersReducedMotion) return;

    // Get card bounds
    const rect = this.card.getBoundingClientRect();
    const cardCenterX = rect.width / 2;
    const cardCenterY = rect.height / 2;

    // Get mouse position relative to card center
    const mouseX = e.clientX - rect.left - cardCenterX;
    const mouseY = e.clientY - rect.top - cardCenterY;

    // Calculate normalized position (-1 to 1)
    const normalizedX = mouseX / cardCenterX;
    const normalizedY = mouseY / cardCenterY;

    // Set target values (will be smoothed by easing)
    this.targetX = normalizedX * this.config.maxTranslate;
    this.targetY = normalizedY * this.config.maxTranslate;
    this.targetRotateZ = normalizedX * this.config.maxRotate;
  };

  private onMouseLeave = () => {
    this.isHovering = false;
    // Smoothly return to neutral position
    this.targetX = 0;
    this.targetY = 0;
    this.targetRotateZ = 0;
  };

  private updateTransform = () => {
    if (!this.image) return;

    // Smooth interpolation using easing
    this.currentX += (this.targetX - this.currentX) * this.config.easing;
    this.currentY += (this.targetY - this.currentY) * this.config.easing;
    this.rotateZ += (this.targetRotateZ - this.rotateZ) * this.config.easing;

    // Apply transform (GPU-accelerated)
    this.image.style.transform = `
      translateX(${this.currentX}px)
      translateY(${this.currentY}px)
      rotateZ(${this.rotateZ}deg)
      translateZ(0)
    `.trim();
  };

  private animate = () => {
    this.updateTransform();

    // Continue animation loop if hovering or not fully reset
    if (
      this.isHovering ||
      Math.abs(this.currentX) > 0.5 ||
      Math.abs(this.currentY) > 0.5 ||
      Math.abs(this.rotateZ) > 0.5
    ) {
      this.animationFrameId = requestAnimationFrame(this.animate);
    } else {
      this.animationFrameId = null;
    }
  };

  destroy = () => {
    if (!this.card) return;

    this.card.removeEventListener('mouseenter', this.onMouseEnter);
    this.card.removeEventListener('mousemove', this.onMouseMove);
    this.card.removeEventListener('mouseleave', this.onMouseLeave);

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  };
}

export function useCardParallax(config?: ParallaxConfig) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!cardRef.current || !imageRef.current) return;

    const parallax = new BikeCardParallax(
      cardRef.current,
      imageRef.current,
      config
    );

    return () => {
      parallax.destroy();
    };
  }, [config]);

  return { cardRef, imageRef };
}
