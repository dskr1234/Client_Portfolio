import React from "react"
export default function Section({ id, title, children, className="" }){
  return (
    <section id={id} className={`soft-2 rounded-[28px] neo p-6 md:p-8 ${className}`}>
      {title && <h2 className="text-3xl font-extrabold mb-6">{title}</h2>}
      {children}
    </section>
  )
}
