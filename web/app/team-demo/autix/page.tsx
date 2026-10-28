import KineticTeamHybrid, {
  type TeamMember,
} from "@/components/ui/kinetic-team-hybrid";

const SISTEMAS: TeamMember[] = [
  { id: "01", name: "Alexander Estrada", role: "Fundador · Autix", image: "/alexander.webp" },
  { id: "02", name: "velOS", role: "Reparto y rutas", image: "/alexander.webp" },
  { id: "03", name: "AgendaOS", role: "Agenda + WhatsApp", image: "/alexander.webp" },
  { id: "04", name: "Merka POS", role: "Punto de venta", image: "/alexander.webp" },
];

export default function AutixTeamDemo() {
  return (
    <KineticTeamHybrid
      team={SISTEMAS}
      title={
        <>
          Quién está <span className="text-neutral-600">detrás</span>
        </>
      }
      caption="Autix · Sistemas a medida"
    />
  );
}
