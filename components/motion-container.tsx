'use client';

import { motion } from 'framer-motion';

export const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            staggerChildren: 0.1,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};

export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};

export function MotionContainer({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function MotionItem({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div variants={itemVariants} className={className}>
            {children}
        </motion.div>
    );
}
