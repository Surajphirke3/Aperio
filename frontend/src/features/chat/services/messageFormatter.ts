import type { ChatResponse, ParsedIntent } from '../types';

export function formatAIResponse(response: ChatResponse): string {
  if (response.action === 'error') {
    return `Error: ${response.reply}`;
  }

  if (response.structuredData) {
    return formatStructuredResponse(response.reply, response.structuredData);
  }

  return response.reply;
}

function formatStructuredResponse(reply: string, data: ParsedIntent): string {
  const parts = [reply];

  if (data.material && data.quantity_kg) {
    parts.push(`Material: ${data.material} — ${data.quantity_kg}kg`);
  }

  if (data.vendor) {
    parts.push(`Vendor: ${data.vendor}`);
  }

  if (data.stage) {
    parts.push(`Stage: ${data.stage}`);
  }

  return parts.join('\n');
}
