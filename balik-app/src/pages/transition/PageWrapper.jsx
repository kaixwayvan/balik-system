import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 25,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.95,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(4px)",
    transition: {
      duration: 0.15,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

export const PageWrapper = ({ children }) => {
  return (
    <div className="w-full flex flex-col flex-1">
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col flex-1"
      >
        {children}
      </motion.div>
    </div>
  );
};