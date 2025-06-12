from flask import Flask, request, jsonify
import os
from huggingface_hub import InferenceClient
import requests
from dotenv import load_dotenv


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

MASTER_TITLE_MODEL = "google/pegasus-xsum" 

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

@app.route('/get_master_title', methods=['POST'])
def get_master_title():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    titles_list = data.get('titlesList')

    if not titles_list or not isinstance(titles_list, list) or len(titles_list) == 0:
        return jsonify({"error": "Invalid input: 'titlesList' must be a non-empty list of strings."}), 400

    joined_titles = ". ".join(titles_list)
    text_to_summarize = f"Generate a concise master title for the following topics: {joined_titles}"

    print(f"DEBUG: Input prompt for master title generation: '{text_to_summarize}'")

    try:
        response_obj = client.summarization(
            text_to_summarize,
            model=MASTER_TITLE_MODEL, 
        )

        master_title = ""
        if hasattr(response_obj, 'summary_text'):
            master_title = response_obj.summary_text.strip()

            # --- START POST-PROCESSING ---
            # Remove common question phrases if they appear at the beginning or end
            question_starters = ["how do you sum up", "what is", "can you summarize", "what are", "how"]
            question_enders = ["?", "."] # Check for trailing periods in questions

            # Convert to lowercase for easier matching, but apply changes to original casing
            lower_master_title = master_title.lower()

            # Check for question starters
            for phrase in question_starters:
                if lower_master_title.startswith(phrase):
                    master_title = master_title[len(phrase):].strip()
                    lower_master_title = master_title.lower() # Update lower_master_title after trimming
                    break # Stop after first match

            # Remove trailing question marks or periods if it became a question
            #if master_title and master_title[-1] in question_enders:
            #    master_title = master_title[:-1]

            # Re-strip in case trimming left leading/trailing spaces
            master_title = master_title.strip()

            # Capitalize the first letter of the (possibly modified) title
            if master_title:
                master_title = master_title[0].upper() + master_title[1:]
            
            # If after all this, it's empty, or still looks like a bad title,
            # you might have a fallback, or just return it as is and accept the imperfections.
            # For now, let's just make sure it's not empty.
            if not master_title and titles_list: # Fallback to first title if all processing fails
                master_title = titles_list[0] + " (Refined Title Failed)" # Indicate fallback
            # --- END POST-PROCESSING ---


        if master_title:
            print(f"DEBUG: Generated Master Title (after post-processing): '{master_title}'")
            return jsonify({"master_title": master_title}), 200
        else:
            print(f"DEBUG: Summarization returned empty or whitespace only result after processing.")
            # If it became empty after processing, perhaps return a default or error
            return jsonify({"error": "Failed to generate a valid master title after processing."}), 502

    except requests.exceptions.RequestException as e:
        print(f"Error communicating with Hugging Face API for master title: {e}")
        return jsonify({"error": f"Failed to generate master title due to external API error: {e}"}), 502
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": f"An internal server error occurred: {e}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)