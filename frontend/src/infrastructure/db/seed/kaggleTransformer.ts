interface RawCSVRow {
  material_type: string;
  quantity_kg: string;
  vendor: string;
  stage: string;
  input_kg: string;
  output_kg: string;
  loss_kg: string;
  date: string;
}

interface TransformedBatch {
  materialType: string;
  quantity_kg: number;
  vendor: string;
  stages: {
    stage: string;
    input_kg: number;
    output_kg: number;
    loss_kg: number;
    timestamp: Date;
  }[];
}

export function transformCSVRow(row: RawCSVRow): TransformedBatch {
  return {
    materialType: row.material_type.toUpperCase(),
    quantity_kg: parseFloat(row.quantity_kg),
    vendor: row.vendor,
    stages: [
      {
        stage: row.stage,
        input_kg: parseFloat(row.input_kg),
        output_kg: parseFloat(row.output_kg),
        loss_kg: parseFloat(row.loss_kg),
        timestamp: new Date(row.date),
      },
    ],
  };
}

export function transformCSVRows(rows: RawCSVRow[]): TransformedBatch[] {
  return rows.map(transformCSVRow);
}
