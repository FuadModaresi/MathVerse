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
  prompt: `You are an expert mathematics educator. A student has provided you with an
equation and has asked you to explain its graph. Provide a concise explanation
of the graph, including key features such as slope, intercepts, and turning points.
Explain any transformation effects (shift, stretch, reflection).

Equation: {{{equation}}}

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
