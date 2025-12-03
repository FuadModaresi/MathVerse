'use server';
/**
 * @fileOverview Explains a graph using AI.
 *
 * - explainGraphWithAI - A function that handles the graph explanation process.
 * - ExplainGraphWithAIInput - The input type for the explainGraphWithAI function.
 * - ExplainGraphWithAIOutput - The return type for the explainGraphWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainGraphWithAIInputSchema = z.object({
  equation: z.string().describe('The equation of the graph to explain.'),
  graphDataUri: z
    .string()
    .describe(
      "A photo of a graph, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExplainGraphWithAIInput = z.infer<typeof ExplainGraphWithAIInputSchema>;

const ExplainGraphWithAIOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the graph.'),
});
export type ExplainGraphWithAIOutput = z.infer<typeof ExplainGraphWithAIOutputSchema>;

export async function explainGraphWithAI(input: ExplainGraphWithAIInput): Promise<ExplainGraphWithAIOutput> {
  return explainGraphWithAIFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainGraphWithAIPrompt',
  input: {schema: ExplainGraphWithAIInputSchema},
  output: {schema: ExplainGraphWithAIOutputSchema},
  prompt: `You are an expert mathematics educator. A student has provided you with a
graph and its equation and has asked you to explain it. Provide a concise explanation
of the graph, including key features such as slope, intercepts, and turning points.
Explain any transformation effects (shift, stretch, reflection).

Equation: {{{equation}}}
Graph: {{media url=graphDataUri}}

Explanation: `,
});

const explainGraphWithAIFlow = ai.defineFlow(
  {
    name: 'explainGraphWithAIFlow',
    inputSchema: ExplainGraphWithAIInputSchema,
    outputSchema: ExplainGraphWithAIOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
