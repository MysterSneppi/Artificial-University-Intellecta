import { AiGenerationClient } from "../clients/AiGenerationClient.js";
import { environment } from "../config/Environment.js";
import { universityGenerationSchema } from "../phases/phase1-generate-university/UniversityGenerationSchema.js";

import type { GeneratedUniversity } from "../models/University.js";

async function main(): Promise<void> {
  const client = new AiGenerationClient({
    baseUrl: environment.llamaServerUrl,
    model: environment.llamaModel,
  });

  await client.healthCheck();

  console.log("llama.cpp server is available");

  const university =
    await client.generateJson<GeneratedUniversity>({
      systemPrompt: [
        "You generate data for a university simulation.",
        "Return only valid JSON matching the provided schema.",
        "Do not use Markdown.",
      ].join(" "),

      prompt: [
        "Generate one fictional modern university.",
        "Use a placeholder address in the format:",
        "\"Улица <number>, дом <number>\".",
        "Set is_active to true.",
      ].join(" "),

      schema: universityGenerationSchema,
      temperature: 0.3,
      maxTokens: 2_048,
    });

  console.log("Generated university:");
  console.dir(university, {
    depth: null,
  });
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : String(error);

  console.error(`AI check failed: ${message}`);
  process.exitCode = 1;
});