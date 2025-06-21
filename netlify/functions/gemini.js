// /netlify/functions/gemini.js

exports.handler = async function(event) {
    // 1. 프론트엔드에서 보낸 요청(prompt)을 받습니다.
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
        return { statusCode: 400, body: 'Prompt is required' };
    }

    // 2. Netlify 환경 변수에 안전하게 저장된 API 키를 불러옵니다.
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
    };

    try {
        // 3. 서버에서 직접 Gemini API를 호출합니다.
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // API 호출 실패 시 에러를 반환합니다.
            const errorBody = await response.text();
            console.error('Gemini API Error:', errorBody);
            return { statusCode: response.status, body: `Gemini API error: ${errorBody}` };
        }

        const result = await response.json();
        const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
            return { statusCode: 500, body: 'Invalid API response structure.' };
        }

        // 4. 성공적인 결과를 프론트엔드로 다시 전달합니다.
        return {
            statusCode: 200,
            body: JSON.stringify({ text: responseText })
        };

    } catch (error) {
        console.error('Proxy function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
