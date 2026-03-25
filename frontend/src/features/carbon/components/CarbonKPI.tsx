interface CarbonKPIProps {
  label: string;
  value: number;
  unit: string;
}

export function CarbonKPI({ label, value, unit }: CarbonKPIProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold">
        {value.toLocaleString()} <span className="text-sm font-normal text-gray-400">{unit}</span>
      </p>
    </div>
  );
}
