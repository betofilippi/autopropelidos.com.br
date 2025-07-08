// Framer Motion animation variants
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0
  },
  exit: { 
    opacity: 0,
    y: -20
  }
};

// Card hover animation
export const cardHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02
  },
  tap: { scale: 0.98 }
};

// Button hover animation
export const buttonHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05
  },
  tap: { scale: 0.95 }
};

// Mobile drawer animation
export const drawerAnimation = {
  initial: { x: "-100%" },
  animate: { 
    x: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300
    }
  },
  exit: { 
    x: "-100%",
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300
    }
  }
};

// Skeleton animation
export const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 1.5,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// Accordion animation
export const accordionAnimation = {
  initial: { height: 0, opacity: 0 },
  animate: { 
    height: "auto", 
    opacity: 1
  },
  exit: { 
    height: 0, 
    opacity: 0
  }
};

// List item animation for mobile
export const listItemAnimation = {
  initial: { opacity: 0, x: -20 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0
  })
};

// Touch gesture animations
export const swipeAnimation = {
  swipeRight: { x: 100, opacity: 0 },
  swipeLeft: { x: -100, opacity: 0 },
  center: { x: 0, opacity: 1 }
};

// Loading spinner animation
export const spinAnimation = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// Focus ring animation
export const focusRing = {
  initial: { scale: 0.95, opacity: 0 },
  focus: { 
    scale: 1, 
    opacity: 1
  }
};