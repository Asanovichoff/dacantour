"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { CONTACT } from "@/lib/data";

export function WhatsAppFloat() {
  return (
    <motion.a
      href={CONTACT.whatsapp}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.4 }}
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-[#25D366] py-3 pl-3 pr-5 text-white shadow-xl shadow-black/20 transition-transform hover:scale-105"
      aria-label="Chat with us on WhatsApp"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20">
        <MessageCircle className="h-5 w-5" />
      </span>
      <span className="hidden text-sm font-medium sm:block">Chat with us</span>
    </motion.a>
  );
}
