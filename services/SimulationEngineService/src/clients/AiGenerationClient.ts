import { Ajv, type AnySchema } from "ajv";

export interface AiGenerationClientOptions {
  baseUrl: string;
  model: string;
  timeoutMs?: number;
}

export interface GenerateJsonOptions {
  systemPrompt: string;
  prompt: string;
  schema: AnySchema;
  temperature?: number;
  maxTokens?: number;
}

interface ChatCompletionResponse {
  choices?: Array<{
    finish_reason?: string | null;

    message?: {
      content?: string | null;
      reasoning_content?: string | null;
    };
  }>;
}

export class AiGenerationClient {
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly timeoutMs: number;

  private readonly ajv = new Ajv({
    allErrors: true,
    strict: true,
  });

  constructor(options: AiGenerationClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.model = options.model;
    this.timeoutMs = options.timeoutMs ?? 120_000;
  }

  async healthCheck(): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/health`,
      {
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!response.ok) {
      const details = await response.text();

      throw new Error(
        `llama.cpp health check failed: ` +
          `${response.status} ${details}`,
      );
    }
  }

  async generateJson<TResult>(
    options: GenerateJsonOptions,
  ): Promise<TResult> {
    const response = await fetch(
      `${this.baseUrl}/v1/chat/completions`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        signal: AbortSignal.timeout(this.timeoutMs),

        body: JSON.stringify({
  model: this.model,

  messages: [
    {
      role: "system",
      content: options.systemPrompt,
    },
    {
      role: "user",
      content: `${options.prompt}\n/no_think`,
    },
  ],

  stream: false,
  reasoning_effort: "none",
  temperature: options.temperature ?? 0.2,
  max_tokens: options.maxTokens ?? 2_048,

  chat_template_kwargs: {
    enable_thinking: false,
  },

  response_format: {
    type: "json_object",
    schema: options.schema,
  },
}),
      },
    );

    if (!response.ok) {
      const details = await response.text();

      throw new Error(
        `llama.cpp request failed: ` +
          `${response.status} ${details}`,
      );
    }

    const responseData =
      (await response.json()) as ChatCompletionResponse;

const choice = responseData.choices?.[0];

    const content =
      responseData.choices?.[0]?.message?.content;

    if (!content) {
  throw new Error(
    `llama.cpp returned empty content. ` +
      `Finish reason: ${choice?.finish_reason ?? "unknown"}`,
  );
}

    const normalizedContent = content.trim();
    let generatedData: unknown;

    try {
  generatedData = JSON.parse(normalizedContent);
} catch (error: unknown) {
  console.error("Raw response from llama.cpp:");
  console.error(normalizedContent);

  console.error(
    "Finish reason:",
    choice?.finish_reason ?? "unknown",
  );

  if (choice?.message?.reasoning_content) {
    console.error("Reasoning content:");
    console.error(choice.message.reasoning_content);
  }

  throw new Error(
    "llama.cpp returned invalid JSON",
    { cause: error },
  );
}

    const validate = this.ajv.compile(options.schema);

    if (!validate(generatedData)) {
      throw new Error(
        `Generated JSON does not match schema: ${
          JSON.stringify(validate.errors)
        }`,
      );
    }

    return generatedData as TResult;
  }
}