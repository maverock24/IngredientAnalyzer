const https = require("https");

// Function to validate Google OAuth token
async function validateGoogleToken(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "oauth2.googleapis.com",
      port: 443,
      path: `/tokeninfo?access_token=${token}`,
      method: "GET",
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const tokenInfo = JSON.parse(data);
          if (tokenInfo.error) {
            reject(new Error(`Token validation failed: ${tokenInfo.error}`));
          } else {
            resolve(tokenInfo);
          }
        } catch (error) {
          reject(new Error(`Failed to parse token info: ${error.message}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(new Error(`Token validation request failed: ${error.message}`));
    });

    req.end();
  });
}

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  try {
    // Validate authentication (optional - can be enabled for production)
    const authHeader = event.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const tokenInfo = await validateGoogleToken(token);
        console.log("Authenticated request from user:", tokenInfo.email);
      } catch (error) {
        console.warn("Token validation failed:", error.message);
        // For now, we'll continue even if token validation fails
        // In production, you might want to return an error here
      }
    }

    const { imageData, productName } = JSON.parse(event.body);

    if (!imageData) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        body: JSON.stringify({ error: "Image data is required" }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        body: JSON.stringify({ error: "API key not configured" }),
      };
    }

    const prompt = `Analyze the ingredients in this ${
      productName || "product"
    } image and provide:

1. **Ingredient List**: Extract all visible ingredients from the image
2. **Health Analysis**: Rate the overall healthiness (1-10 scale)
3. **Concerns**: List any potentially harmful ingredients or allergens
4. **Benefits**: List any beneficial ingredients
5. **Recommendations**: Suggest alternatives if needed

Please provide your response in a structured format with clear sections.`;

    const requestData = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageData.split(",")[1], // Remove data:image/jpeg;base64, prefix
              },
            },
          ],
        },
      ],
    };

    const geminiResponse = await makeGeminiRequest(apiKey, requestData);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(geminiResponse),
    };
  } catch (error) {
    console.error("Error processing request:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
    };
  }
};

function makeGeminiRequest(apiKey, requestData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(requestData);

    const options = {
      hostname: "generativelanguage.googleapis.com",
      port: 443,
      path: `/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(data);

          if (response.error) {
            reject(new Error(`Gemini API error: ${response.error.message}`));
            return;
          }

          if (
            response.candidates &&
            response.candidates[0] &&
            response.candidates[0].content
          ) {
            resolve({
              analysis: response.candidates[0].content.parts[0].text,
              raw: response,
            });
          } else {
            reject(new Error("Unexpected response format from Gemini API"));
          }
        } catch (error) {
          reject(
            new Error(`Failed to parse Gemini API response: ${error.message}`)
          );
        }
      });
    });

    req.on("error", (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.write(postData);
    req.end();
  });
}
