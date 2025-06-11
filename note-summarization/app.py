from flask import Flask, request, jsonify
import os
from huggingface_hub import InferenceClient
import requests

app = Flask(__name__)

try:
    client = InferenceClient(
        provider="hf-inference",
        api_key=os.environ["HF_TOKEN"],
    )
    print("Hugging Face InferenceClient initialized successfully.")
except KeyError:
    print("Error: HF_TOKEN environment variable not set. Please set it before running the application.")
    exit(1)
except Exception as e:
    print(f"Error initializing Hugging Face InferenceClient: {e}")
    exit(1)

SUMMARIZATION_MODEL = "Falconsai/text_summarization"

@app.route('/get_summarized_text', methods=['POST'])
def get_summarized_text():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()

    data_list = data.get('notesList')
    print(data_list)

    if not data_list or not isinstance(data_list, list) or len(data_list) == 0:
        return jsonify({"error": "Invalid input: 'data_list' must be a non-empty list of strings."}), 400

    text_to_summarize = " ".join(data_list)
    print(f"DEBUG: Input text for summarization: '{text_to_summarize}'")

    try:
        result = client.summarization(
            text_to_summarize,
            model=SUMMARIZATION_MODEL,
        )

        if hasattr(result, 'summary_text'):
            summary = result.summary_text
            print(f"DEBUG: Extracted summary: '{summary}'")
            return jsonify({"summary": summary}), 200
        else:
            print(f"DEBUG: Result object does not contain 'summary_text' attribute: {result}")
            return jsonify({"error": "Summarization model response missing 'summary_text' attribute."}), 502

    except requests.exceptions.RequestException as e:
        print(f"Error communicating with Hugging Face API: {e}")
        return jsonify({"error": f"Failed to summarize text due to external API error: {e}"}), 502
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": f"An internal server error occurred: {e}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)