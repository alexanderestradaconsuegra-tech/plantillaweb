"use client";

import * as React from "react";
import { AnalyticsBento } from "@/components/ui/analytics-bento";

function useFonts() {
  React.useEffect(() => {
    const id = "geist-fonts";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap";
    document.head.appendChild(l);
  }, []);
}

const bell = (x: number, m: number, s: number) => Math.exp(-(((x - m) / s) ** 2) / 2);
const hours = Array.from({ length: 25 }, (_, h) => h);
const mostrador = [0, 1, 2].map((w) => hours.map((h) => Math.round(2400 * (1 - w * 0.16) * (bell(h, 13 - w * 0.6, 3.4) * 0.92 + bell(h, 20, 2.2) * 0.18))));
const whatsapp = [0, 1, 2].map((w) => hours.map((h) => Math.round(2600 * (1 - w * 0.18) * (bell(h, 20.5 - w * 0.4, 3) * 0.95 + bell(h, 8, 1.8) * 0.2))));
const diario = [612, 640, 598, 655, 702, 688, 540, 575, 630, 664, 701, 718, 690, 560, 588, 645, 672, 710, 735, 748, 702, 590, 612, 668, 705, 742, 760, 781, 770, 804];
const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function AutixBentoDemo() {
  useFonts();
  return (
    <div className="theme-autix relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      {/* arcos suaves de fondo */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-60" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={i} cx={1500 - i * 70} cy={500} rx={900 - i * 90} ry={700 - i * 60} fill="none" stroke="#fff" strokeOpacity={0.65 - i * 0.08} strokeWidth={36} />
        ))}
      </svg>

      <div className="relative mx-auto flex max-w-[1500px] items-center gap-8 px-4 py-14 sm:px-8 lg:py-20">
        {/* título vertical */}
        <div aria-hidden="true" className="hidden select-none lg:block">
          <span className="block text-[132px] font-semibold leading-none tracking-tight text-[#0b1c25]/10 [text-orientation:mixed] [writing-mode:vertical-rl] rotate-180">AUTIX PANEL</span>
        </div>

        {/* ventana inclinada: se endereza al pasar el cursor */}
        <div className="min-w-0 flex-1 [perspective:2200px]">
          <div className="group origin-left transition-transform duration-700 [transition-timing-function:cubic-bezier(.2,.9,.25,1)] [transform:rotateY(-14deg)_rotateX(4deg)_rotateZ(-1.5deg)] hover:[transform:none] motion-reduce:[transform:none]">
            <div className="rounded-[34px] bg-white/80 p-3 shadow-[0_40px_90px_-30px_rgba(11,28,37,.45),0_0_0_1px_rgba(11,28,37,.06)] backdrop-blur">
              {/* barra del navegador */}
              <div className="flex items-center gap-3 px-3 pb-3 pt-1">
                <span className="flex gap-1.5">
                  <i className="size-2.5 rounded-full bg-[#ff6159]" /><i className="size-2.5 rounded-full bg-[#febc2e]" /><i className="size-2.5 rounded-full bg-[#28c840]" />
                </span>
                <span className="mx-auto flex h-7 w-full max-w-md items-center justify-center rounded-full bg-[#e3f0f6] text-xs text-[#5b7482]">velos.autix.pro</span>
                <span className="w-12" />
              </div>
              <div className="rounded-[24px] bg-[#0b1c25] p-[3px]">
                <div className="rounded-[22px] bg-[#eef7fb] p-4 sm:p-5">
                  <AnalyticsBento
                    credit={false}
                    currency="$"
                    colors={{ revenue: ["#2fc7e4", "#0e7a96"], desktop: ["#2fc7e4", "#0e7a96"], mobile: ["#8b6cff", "#4b2fd0"], radar: "#0e9fbd" }}
                    revenue={{
                      label: "Ventas del mes (miles)",
                      value: 18420,
                      delta: "8,2%",
                      note: <>Ticket promedio <span className="text-foreground/80">$24,8 mil</span></>,
                      caption: "Ventas diarias, últimos 30 días",
                      series: diario.map((value, i) => ({ value, label: `${i + 1} ${MES[9]}` })),
                    }}
                    sessions={{
                      label: "Pedidos",
                      value: 3482,
                      delta: "12,4%",
                      note: "Por hora, últimas 3 semanas",
                      desktop: mostrador,
                      mobile: whatsapp,
                      labels: { desktop: "Mostrador", mobile: "WhatsApp", prior: "Semanas anteriores", current: "esta semana" },
                    }}
                    categories={{
                      title: "Ventas por área",
                      groups: [
                        { id: "prod", name: "Producción", color: "#1f7a92", ink: "light" },
                        { id: "rep", name: "Reparto", color: "#2fc7e4", ink: "dark" },
                        { id: "cob", name: "Cobranza", color: "#ff9559", ink: "dark" },
                        { id: "age", name: "Agenda", color: "#8b6cff", ink: "light" },
                        { id: "otr", name: "Otros", color: "color-mix(in oklab, var(--color-muted-foreground) 40%, var(--color-muted))" },
                      ],
                      periods: [
                        { label: "Semanal", total: 4380000, delta: "9,6%", compare: "vs $3.996.000 semana anterior" },
                        { label: "Mensual", total: 18420000, delta: "8,2%", compare: "vs $17.020.000 mes anterior" },
                        { label: "Anual", total: 201300000, delta: "22%", compare: "vs $165.000.000 año anterior" },
                      ],
                      items: [
                        { name: "Venta mayorista", group: "prod", values: [1480000, 6200000, 68000000] },
                        { name: "Producción", group: "prod", values: [820000, 3300000, 36000000] },
                        { name: "Reparto norte", group: "rep", values: [640000, 2700000, 29000000] },
                        { name: "Reparto sur", group: "rep", values: [510000, 2150000, 24500000] },
                        { name: "Cobranza", group: "cob", values: [430000, 1850000, 20400000] },
                        { name: "Fiado", group: "cob", values: [190000, 820000, 9100000] },
                        { name: "Reservas", group: "age", values: [210000, 900000, 9800000] },
                        { name: "Servicios", group: "age", values: [90000, 380000, 4300000] },
                        { name: "Mostrador", group: "otr", values: [160000, 690000, 7600000] },
                      ],
                      table: {
                        columns: ["Local", "Semanal", "Mensual", "Anual"],
                        rows: [
                          { label: "Local 1", values: ["$2.140.000", "$9.050.000", "$98.200.000"] },
                          { label: "Local 2", values: ["$1.380.000", "$5.920.000", "$64.700.000"] },
                          { label: "Local 3", values: ["$860.000", "$3.450.000", "$38.400.000"] },
                        ],
                      },
                    }}
                    seasonality={{
                      title: "Estacionalidad",
                      axis: MESES,
                      years: [
                        {
                          label: "2026",
                          values: [16120, 20540, 24440, 18460, 28080, 21580, 17160, 25740, 30160, 22880, 32240, 23660],
                          stats: [
                            { label: "Promedio mensual", value: 16775000, delta: "19,6%", note: "4.221 pedidos" },
                            { label: "Total del año", value: 201300000, delta: "22%", note: "50.652 pedidos" },
                          ],
                          rows: [{ label: "Local 1", value: "$98.200.000" }, { label: "Local 2", value: "$64.700.000" }, { label: "Local 3", value: "$38.400.000" }],
                        },
                        {
                          label: "2025",
                          values: [13260, 16640, 18720, 22360, 20020, 15860, 14560, 19240, 23920, 26260, 23140, 19760],
                          stats: [
                            { label: "Promedio mensual", value: 13750000, delta: "8,1%", note: "3.890 pedidos" },
                            { label: "Total del año", value: 165000000, delta: "4,4%", note: "46.680 pedidos" },
                          ],
                          rows: [{ label: "Local 1", value: "$81.000.000" }, { label: "Local 2", value: "$52.400.000" }, { label: "Local 3", value: "$31.600.000" }],
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
