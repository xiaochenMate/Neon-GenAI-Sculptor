import { GoogleGenAI, Type } from "@google/genai";
import { ModelDef } from "../types";

// Initialize lazily to prevent top-level crashes if env vars are missing during build/deploy
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your settings.");
  }
  return new GoogleGenAI({ apiKey });
};

export async function generateModelUpdate(
  currentModel: ModelDef,
  prompt: string,
  modelList: ModelDef[]
): Promise<{ model: ModelDef; message: string }> {
  try {
    const ai = getAiClient();
    const modelNames = modelList.map((m) => m.name).join(", ");
    
    const systemInstruction = `
      You are a 3D generative artist assistant. Your job is to interpret user requests and generate a JSON configuration for a 3D visualization engine.
      
      Available Shape Types:
      - heart (params: scale, particles, color)
      - saturn (params: ringDist, ringWidth, planetScale, color)
      - torusKnot (params: p, q, radius, tubeRadius, color)
      - flower (params: k, radius, zRange, color)
      - sphere (params: radius, particles, color)
      - star (params: outerRadius, innerRadius, points, depth, color)
      - cubeCloud (params: size, count, color)
      - doubleHelix (params: radius, height, turns, color)
      - wave (params: amplitude, frequency, width, depth, color)
      - text (params: text, size, thickness, color)

      Colors should be hex codes.
      
      If the user asks for a new specific shape not in the list, try to approximate it with one of the available types (e.g., a "planet" could be a sphere or saturn).
      If the user wants to modify the current model, update its parameters.
      If the user wants a completely new concept, create a new model definition.
      
      Return a JSON object with:
      1. 'responseMessage': A short, creative confirmation message (e.g., "Sculpting a neon galaxy for you...").
      2. 'modelConfig': The ModelDef object containing 'name', 'type', 'params', and a simple SVG 'thumbnail' string (just a placeholder path is fine if complex).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Current Model Context: ${JSON.stringify(currentModel)}
        Available Models in Library: ${modelNames}
        User Request: ${prompt}
      `,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            responseMessage: { type: Type.STRING },
            modelConfig: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING },
                params: { 
                  type: Type.OBJECT,
                  properties: {
                    scale: { type: Type.NUMBER },
                    particles: { type: Type.NUMBER },
                    color: { type: Type.STRING },
                    ringDist: { type: Type.NUMBER },
                    ringWidth: { type: Type.NUMBER },
                    planetScale: { type: Type.NUMBER },
                    p: { type: Type.NUMBER },
                    q: { type: Type.NUMBER },
                    radius: { type: Type.NUMBER },
                    tubeRadius: { type: Type.NUMBER },
                    k: { type: Type.NUMBER },
                    zRange: { type: Type.NUMBER },
                    outerRadius: { type: Type.NUMBER },
                    innerRadius: { type: Type.NUMBER },
                    points: { type: Type.NUMBER },
                    depth: { type: Type.NUMBER },
                    size: { type: Type.NUMBER },
                    count: { type: Type.NUMBER },
                    height: { type: Type.NUMBER },
                    turns: { type: Type.NUMBER },
                    amplitude: { type: Type.NUMBER },
                    frequency: { type: Type.NUMBER },
                    width: { type: Type.NUMBER },
                    text: { type: Type.STRING },
                    thickness: { type: Type.NUMBER },
                  }
                },
                thumbnail: { type: Type.STRING },
              },
              required: ["name", "type", "params", "thumbnail"],
            },
          },
          required: ["responseMessage", "modelConfig"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    
    // Ensure params are clean numbers where expected
    const cleanedParams: any = { ...result.modelConfig.params };
    
    return {
      model: {
        ...result.modelConfig,
        params: cleanedParams
      },
      message: result.responseMessage
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return the current model but with an error message so the UI doesn't break
    return {
        model: currentModel,
        message: "Unable to connect to the AI service. Please check your API Key configuration."
    };
  }
}