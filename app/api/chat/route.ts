import { NextRequest, NextResponse } from "next/server";

type AgentType = "explainer" | "coder" | "quiz" | "diagram";

const AGENT_PROMPTS: Record<AgentType, string> = {
  explainer:
    "You are an expert AI tutor specializing in clear explanations. Focus on AI/ML topics like Reasoning Models, Reinforcement Learning, Neural Networks, and Transformers. Use simple analogies, break concepts into steps, and make complex ideas easy to understand. Use markdown formatting with headers, bold text, and tables when helpful.",

  coder:
    "You are an AI coding tutor. When explaining AI/ML concepts, ALWAYS include working Python code examples. Use simple libraries like numpy when possible. Add clear comments in the code. After the code, briefly explain what each part does. Focus on practical, runnable examples related to AI and machine learning.",

  quiz: `You are a quiz generator for AI/ML topics. Based on what the student has been learning in this conversation, generate a quiz question. You MUST respond in this EXACT JSON format and nothing else — no markdown, no backticks, no extra text:
{"type":"quiz","question":"your question here","options":["option A","option B","option C","option D"],"correctIndex":0,"explanation":"why the answer is correct"}`,

  diagram: `You are a visual learning assistant for AI/ML topics. Create a step-by-step diagram. Respond with ONLY valid JSON, no other text. Use this exact structure:
{"type":"diagram","title":"Your Title","steps":[{"label":"Step 1 Name","description":"What happens in step 1"},{"label":"Step 2 Name","description":"What happens in step 2"},{"label":"Step 3 Name","description":"What happens in step 3"},{"label":"Step 4 Name","description":"What happens in step 4"},{"label":"Step 5 Name","description":"What happens in step 5"}]}
Important: "steps" must be a flat array of objects. Each object has "label" and "description" strings. Include 4-7 steps. No nested objects.`,
};

function detectAgent(
  messages: { role: string; content: string }[]
): AgentType {
  const lastMessage =
    messages[messages.length - 1]?.content.toLowerCase() || "";

  if (
    lastMessage.includes("quiz") ||
    lastMessage.includes("test me") ||
    lastMessage.includes("check my understanding")
  ) {
    return "quiz";
  }

  if (
    lastMessage.includes("diagram") ||
    lastMessage.includes("visualize") ||
    lastMessage.includes("show me how") ||
    lastMessage.includes("step by step") ||
    lastMessage.includes("flow") ||
    lastMessage.includes("process of")
  ) {
    return "diagram";
  }

  if (
    lastMessage.includes("code") ||
    lastMessage.includes("example in python") ||
    lastMessage.includes("implement") ||
    lastMessage.includes("show me how to build") ||
    lastMessage.includes("programming")
  ) {
    return "coder";
  }

  return "explainer";
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const agent = detectAgent(messages);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            { role: "system", content: AGENT_PROMPTS[agent] },
            ...messages,
          ],
        }),
      }
    );

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response.";
      console.log("Agent:", agent, "Reply:", reply.substring(0, 200));

    let parsedQuiz = null;
    let parsedDiagram = null;

    if (agent === "quiz") {
      try {
        const cleaned = reply.replace(/```json|```/g, "").trim();
        parsedQuiz = JSON.parse(cleaned);
      } catch {}
    }

    if (agent === "diagram") {
        try {
          const cleaned = reply.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(cleaned);
          if (parsed.steps && Array.isArray(parsed.steps)) {
            parsedDiagram = parsed;
          } else if (parsed.steps && parsed.steps.steps && Array.isArray(parsed.steps.steps)) {
            parsedDiagram = { type: "diagram", title: parsed.title, steps: parsed.steps.steps };
          }
        } catch {}
      }

    return NextResponse.json({
      reply: parsedQuiz || parsedDiagram ? "" : reply,
      quiz: parsedQuiz,
      diagram: parsedDiagram,
      agent: agent,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { reply: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}