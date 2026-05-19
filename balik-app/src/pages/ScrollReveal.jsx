import { motion } from "framer-motion";

// Clean ease curve (Cubic Bezier out-expo/quad blend)
const customEase = [0.215, 0.610, 0.355, 1.000];

export const ScrollReveal = ({ children, delay = 0, duration = 0.8, direction = "up" }) => {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    fade: { x: 0, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration, delay, ease: customEase }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ children, delayChildren = 0, speed = 0.15 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: speed, 
            delayChildren: delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, direction = "up" }) => {
  const directions = {
    up: { y: 45, x: 0 },
    down: { y: -45, x: 0 },
    left: { x: 45, y: 0 },
    right: { x: -45, y: 0 },
  };

  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: 0, 
          ...directions[direction],
          scale: 0.96
        },
        visible: { 
          opacity: 1, 
          x: 0, 
          y: 0, 
          scale: 1,
          transition: { 
            type: "spring", 
            stiffness: 70, 
            damping: 16,
            mass: 0.8
          } 
        },
      }}
    >
      {children}
    </motion.div>
  );
};