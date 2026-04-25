const BEDROCK_API_KEY = process.env.BEDROCK_API_KEY!;
const BEDROCK_REGION = process.env.BEDROCK_REGION || "ap-southeast-5";
const MODEL_ID = "amazon.nova-micro-v1:0";

export async function callNovaMicro(prompt: string): Promise<Record<string, unknown>> {
  const response = await fetch(
    `https://bedrock-runtime.${BEDROCK_REGION}.amazonaws.com/model/${MODEL_ID}/converse`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BEDROCK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [{ text: prompt }],
          },
        ],
        inferenceConfig: {
          temperature: 0.7,
          maxTokens: 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Bedrock error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  let text = data.output?.message?.content?.[0]?.text || "";

  // Clean up markdown code blocks if present
  text = text.trim();
  if (text.startsWith("```")) {
    text = text.split("\n", 1)[1] || text;
  }
  if (text.endsWith("```")) {
    text = text.rsplit ? text : text.slice(0, text.lastIndexOf("```"));
  }
  text = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();

  return JSON.parse(text);
}
