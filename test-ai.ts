import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

async function main() {
  try {
    const result = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({
        schema: z.object({ msg: z.string() })
      }),
      prompt: "Say hello",
    });
    console.log("Keys:", Object.keys(result));
    console.log("experimental_output:", result.experimental_output);
    console.log("object:", (result as any).object);
  } catch (e) {
    console.log(e);
  }
}
main();
