import React from "react";
import Section from "./Section";
import Tilt3D from "./Tilt3D";
import { motion } from "framer-motion";
import { profile } from "../lib/data";

export default function FuturePlans(){
  const plans = Array.isArray(profile?.futurePlans) && profile.futurePlans.length
    ? profile.futurePlans
    : [
        { title: "Ship v2 of Portfolio", when: "Q4", desc: "Add blog, case-studies, and live coding playground." },
        { title: "RecruiteMee Lite SaaS", when: "Q4–Q1", desc: "Public landing + auth + Stripe + influencer flow." },
        { title: "LeetCode 300+", when: "This year", desc: "Target DS/Algo patterns with weekly checkpoints." },
      ];

  return (
    <Section id="future" title="Future Plans">
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p, i)=>(
          <Tilt3D key={i}>
            <motion.div
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }} transition={{ duration: .5 }}
              className="card-neo rounded-[20px] p-5 relative overflow-hidden"
            >
              <div className="shine" />
              <div className="text-xs font-semibold text-theme-subtle">{p.when}</div>
              <h4 className="text-lg font-bold mt-1 text-theme">{p.title}</h4>
              <p className="mt-2 text-sm text-theme-muted">{p.desc}</p>
            </motion.div>
          </Tilt3D>
        ))}
      </div>
    </Section>
  );
}
