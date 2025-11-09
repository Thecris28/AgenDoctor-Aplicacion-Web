
'use client';
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import NavbarWeb from "./NavbarWeb";
import NavbarMobile from "./NavbarMobile";
import { useState } from 'react';
import Image from 'next/image';

const headerVariants = {
  visible: { y: 0 },
  hidden: { y: "-100%" },
  withBg: {
    backgroundColor: "white",
  },
  withoutBg: { backgroundColor: "transparent" },
};

export default function Header() {

  const [bg, setBg] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious();
    if (!prev) return;

    if (latest > prev && latest > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }

    if (latest > 50) {
      setBg(true);
    } else {
      setBg(false);
    }
  });

  return (


    <motion.header
      variants={headerVariants}
      animate={[hidden ? "hidden" : "visible", bg ? "withBg" : "withoutBg"]}
      transition={{ ease: "linear", duration: 0.2 }}
      className="fixed w-full z-20 top-0 start-0">
      <div className=''>
        
        <NavbarMobile />
        <NavbarWeb />
      </div>

    </motion.header>



  )
}
