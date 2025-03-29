from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
import pytesseract
import cv2
import whisper
from yt_dlp import YoutubeDL
import uuid
import os
import openai
import json

# Access the API key from environment variable
api_key = os.getenv("OPENAI_API_KEY")
pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"

app = FastAPI()
whisper_model = whisper.load_model("base")
client = openai.OpenAI(api_key=api_key)

# Request body
class TikTokLink(BaseModel):
    url: str

def download_tiktok(link, filename):
    ydl_opts = {
        'outtmpl': filename,
        'format': 'mp4',
    }
    with YoutubeDL(ydl_opts) as ydl:
        ydl.download([link])
    return filename

def extract_audio(video_path, audio_path):
    try:
        subprocess.run(['/usr/bin/ffmpeg', '-i', video_path, '-q:a', '0', '-map', 'a', audio_path, '-y'], capture_output=True)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
    return audio_path

def transcribe_audio(audio_path):
    try:
        result = whisper_model.transcribe(audio_path)
        return result['text']
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


def get_video_length(video_path):
    try:
        # Run ffprobe to get the video duration
        result = subprocess.run(
            ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', video_path],
            capture_output=True,
            text=True
        )
        # Extract and return the duration in seconds
        return float(result.stdout.strip())
    except Exception as e:
        print(f"Error getting video length: {e}")
        return None


def extract_text_from_frames(video_path, frame_skip=5):
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    ocr_texts = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_count % frame_skip == 0:
            text = pytesseract.image_to_string(frame)
            if text.strip():
                ocr_texts.append(text)
        frame_count += 1
    cap.release()
    return " ".join(ocr_texts)

def extract_locations(text1, text2):
    prompt = """You will be given 2 set of text. The first set is the transcript of the audio. The second set is the text extracted from the video frames. The 2 sets of text are from the same video. As this is a travel guide, sometimes the transcribed text could be empty if it is fully visual.
                 Text from video frames can be harder to understand. Please understand the text and identify the locations mentioned in the text. Double check whether the location exist and it should be likely a place recommended to go. Text spelling could be wrong so make sense out of it as best as you can. If you are unsure, you can skip the question.
                 You are to return in the following format and NOTHING ELSE:
                 
                     "{"locations": ["location1", "location2"]}"
                 """
    
    try:
        response = client.chat.completions.create(
            model="chatgpt-4o-latest",  # Or use gpt-4 if available
            messages=[{"role": "system", "content": "You are a well known tour guide who knows all the places around the world"},
                      {"role": "user", "content": prompt + "\nFollowing are the 2 text\nTranscript:\n" + text1 + "\n\nVisual Text:\n" + text2}],
            max_tokens=100,
            temperature=0,
            n=1,
            stop=None
        )
        print(response.choices[0].message.content)
        locations = response.choices[0].message.content.strip()
        return json.loads(locations)["locations"]  # Split locations by new lines if needed
    except Exception as e:
        print(f"Error: {e}")
        return []

@app.post("/extract-locations/")
def extract_locations_from_tiktok(req: TikTokLink):
    try:
        session_id = str(uuid.uuid4())
        video_file = f"{session_id}.mp4"
        audio_file = f"{session_id}.wav"

        download_tiktok(req.url, video_file)
        print(video_file)
        extract_audio(video_file, audio_file)
        print("DONE AUDIO EXTRACTION")
        transcript = transcribe_audio(audio_file)
        print("DONE TRANSCRIPT")
        duration = get_video_length(video_file)
        skip_frames = max(int(duration / 10) * 5, 5)
        print(skip_frames)
        print("DONE VIDEO LENGTH")
        visual_text = extract_text_from_frames(video_file, skip_frames)
        print("DONE VISUAL TEXT")
        #full_text = transcript + "\n" + visual_text
        #print(visual_text)
        locations = extract_locations(transcript, visual_text)

        # Cleanup
        os.remove(video_file)
        os.remove(audio_file)

        return {"locations": locations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))