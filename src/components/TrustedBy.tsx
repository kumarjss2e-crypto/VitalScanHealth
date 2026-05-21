"use client";

import React from "react";
import { motion } from "framer-motion";

const companies = [
  "HealthLine", "BioTech", "MediCore", "Vitality", "NeuroScan", "Optima"
];

const TrustedBy = () => {
  return (
    <section className="py-20 border-y border-white/5 bg-black/20">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-white/30 text-sm font-bold uppercase tracking-[0.2em] mb-12">
          Powering the next generation of wellness
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          {companies.map((company, index) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-2xl font-black text-white tracking-tighter"
            >
              {company}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
