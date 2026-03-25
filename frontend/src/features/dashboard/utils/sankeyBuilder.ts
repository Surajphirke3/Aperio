import type { SankeyData, SankeyNode, SankeyLink } from '@/shared/types';

interface StageData {
  stage: string;
  quantity_kg: number;
  loss_kg: number;
}

export function buildSankeyData(stages: StageData[]): SankeyData {
  const nodes: SankeyNode[] = [];
  const links: SankeyLink[] = [];

  stages.forEach((stage, index) => {
    nodes.push({
      id: stage.stage,
      label: stage.stage.charAt(0).toUpperCase() + stage.stage.slice(1),
      value: stage.quantity_kg,
    });

    if (index > 0) {
      links.push({
        source: stages[index - 1].stage,
        target: stage.stage,
        value: stage.quantity_kg,
      });
    }

    if (stage.loss_kg > 0) {
      const lossId = `${stage.stage}-loss`;
      nodes.push({
        id: lossId,
        label: `${stage.stage} Loss`,
        value: stage.loss_kg,
      });
      links.push({
        source: stage.stage,
        target: lossId,
        value: stage.loss_kg,
      });
    }
  });

  return { nodes, links };
}
