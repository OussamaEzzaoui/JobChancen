// Keep the same exported function name so the rest of WerkMatch
// does not need to be changed.
export async function requestOpenCode(
  body: Record<string, unknown>,
  sessionId: string = crypto.randomUUID(),
): Promise<Record<string, unknown>> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const input = (body.input ?? []) as {
    role?: string;
    content?: string;
  }[];

  const systemMessages = input
    .filter((item) => item.role === 'system')
    .map((item) => item.content ?? '')
    .join('\n\n');

  const userMessages = input
    .filter((item) => item.role !== 'system')
    .map((item) => item.content ?? '')
    .join('\n\n');

  const textConfig = body.text as
    | {
        format?: {
          schema?: Record<string, unknown>;
        };
      }
    | undefined;

  const schema = textConfig?.format?.schema;
	function simplifySchema(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(simplifySchema);
  }

  if (value && typeof value === 'object') {
    const input = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};

    for (const [key, item] of Object.entries(input)) {
      if (
        [
          'maxItems',
          'minItems',
          'maxLength',
          'minLength',
          'pattern',
          'default',
          'const',
        ].includes(key)
      ) {
        continue;
      }

      output[key] = simplifySchema(item);
    }

    return output;
  }

  return value;
}

const geminiSchema = schema ? simplifySchema(schema) : undefined;

  // You can change this later if desired.
  const model =
    process.env.GEMINI_MATCH_MODEL ??
    'gemini-2.5-flash';

  const geminiBody: Record<string, unknown> = {
    systemInstruction: {
      parts: [
        {
          text: systemMessages,
        },
      ],
    },

    contents: [
      {
        role: 'user',
        parts: [
          {
            text: userMessages,
          },
        ],
      },
    ],

    generationConfig: {
      maxOutputTokens:
        typeof body.max_output_tokens === 'number'
          ? body.max_output_tokens
          : 7000,

      ...(schema
        ? {
            responseMimeType: 'application/json',
            responseJsonSchema: geminiSchema,
          }
        : {}),
    },
  };

  for (let attempt = 0; ; attempt += 1) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },

        body: JSON.stringify(geminiBody),

        signal: AbortSignal.timeout(120_000),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      if (
        attempt < 2 &&
        [429, 500, 502, 503, 504].includes(response.status)
      ) {
        const retryAfter = Number(
          response.headers.get('Retry-After'),
        );

        await new Promise((resolve) =>
          setTimeout(
            resolve,
            Math.min(
              30_000,
              Math.max(
                1_000 * 2 ** attempt,
                retryAfter * 1_000 || 0,
              ),
            ),
          ),
        );

        continue;
      }

      throw new Error(
        `Gemini request failed with status ${response.status}: ${errorText}`,
      );
    }

    const geminiResponse = (await response.json()) as {
      candidates?: {
        content?: {
          parts?: {
            text?: string;
          }[];
        };
      }[];
    };

    const outputText =
      geminiResponse.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? '')
        .join('') ?? '';

    // Convert Gemini's response back into the shape
    // WerkMatch already expects.
    return {
      output: [
        {
          content: [
            {
              type: 'output_text',
              text: outputText,
            },
          ],
        },
      ],

      session_id: sessionId,
    };
  }
}