import os
import re
import json
import requests
import subprocess
from datetime import datetime
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Configuration
BLOG_ID = "3944571224078646076"
SCOPES = ['https://www.googleapis.com/auth/blogger']
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# Absolute path mapping to your Vite framework setup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_FEED_PATH = os.path.join(BASE_DIR, "public", "posts.json")
CREDENTIALS_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "credentials.json")
TOKEN_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "token.json")

def get_blogger_service():
    creds = None
    if os.path.exists(TOKEN_PATH):
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_PATH, 'w') as token:
            token.write(creds.to_json())
    return build('blogger', 'v3', credentials=creds)

def generate_llm_post(topic):
    if not GEMINI_API_KEY:
        raise ValueError("❌ Missing GEMINI_API_KEY! Run: export GEMINI_API_KEY='your_key'")

    # 1. Clean endpoint URL (No '?key=' string attached)
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent"
    
    # 2. Pass the key via headers (MANDATORY for new 'AQ.' format keys)
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
    }
    
    prompt = f"""
    Write a short high-quality technical blog post about: '{topic}'.
    Provide the response strictly as a JSON object with these keys:
    - title
    - body
    - meta_description
    - seo_keywords

    The 'body' key must contain HTML formatting (<p>, <h3>, <strong>) and must not include markdown characters.
    The 'meta_description' should be 140-160 characters and optimized for Google search.
    The 'seo_keywords' should be a comma-separated list of 8-12 relevant search phrases.
    Return only valid JSON without any extra explanation.
    """
    
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }
    
    # 3. Inject the headers mapping into the post request
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    
    response_data = response.json()
    raw_text = response_data['candidates'][0]['content']['parts'][0]['text']
    
    try:
        result = json.loads(raw_text)
        return (
            result['title'],
            result['body'],
            result.get('meta_description', ''),
            result.get('seo_keywords', '')
        )
    except (json.JSONDecodeError, KeyError) as e:
        print(f"⚠️ JSON parsing anomaly detected: {e}. Executing string-repair fallback sequence.")
        return (
            f"Automated Update: {topic}",
            f"<p>Reviewing implementation mechanics regarding {topic}. See project components for architecture updates.</p>",
            f"Learn how to {topic} with practical tips and expert advice.",
            "3D printing India, 3D printing guide, 2024 3D printing, beginner 3D printing"
        )

def slugify(text):
    slug = text.lower().strip()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"[\s_-]+", "-", slug)
    return slug


def post_to_blogger(title, content, seo_keywords=None):
    service = get_blogger_service()
    labels = [kw.strip() for kw in (seo_keywords or '').split(',') if kw.strip()]
    body = {
        "kind": "blogger#post",
        "title": title,
        "content": content,
    }
    if labels:
        body["labels"] = labels
    request = service.posts().insert(blogId=BLOG_ID, body=body)
    return request.execute()

def update_local_json(title, content, blogger_url, meta_description='', seo_keywords=''):
    posts = []
    if os.path.exists(JSON_FEED_PATH):
        try:
            with open(JSON_FEED_PATH, 'r', encoding='utf-8') as f:
                posts = json.load(f)
        except json.JSONDecodeError:
            pass

    new_post = {
        "id": slugify(title),
        "title": title,
        "content": content,
        "date": datetime.now().strftime("%d %B %Y"),
        "excerpt": meta_description,
        "keywords": seo_keywords,
        "url": blogger_url
    }
    posts.insert(0, new_post)
    posts = posts[:10]

    with open(JSON_FEED_PATH, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

def push_to_github():
    try:
        os.chdir(BASE_DIR)
        subprocess.run(["git", "add", "public/posts.json"], check=True)
        subprocess.run(["git", "commit", "-m", "🤖 Auto-published blog data payload via Gemini"], check=True)
        subprocess.run(["git", "push"], check=True)
        print("🚀 Vite static data packet successfully pushed to GitHub!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Git push failed: {e}")

if __name__ == "__main__":
    topic = "Why NFC Keychains Are the Perfect Modern Gift"
    
    print("🤖 Prompting Google Gemini Engine (Structured JSON Mode)...")
    title, content, meta_description, seo_keywords = generate_llm_post(topic)
    print(f"✅ Generated Title: {title}")
    print(f"✅ Generated Meta Description: {meta_description}")
    print(f"✅ Generated SEO Keywords: {seo_keywords}")
    
    print("✍️ Dispatching to Google Blogger API...")
    blogger_result = post_to_blogger(title, content, seo_keywords)
    blogger_url = blogger_result.get('url', 'https://blogger.com')
    
    print("📁 Compiling into public assets directory...")
    update_local_json(title, content, blogger_url, meta_description, seo_keywords)
    
    print("📦 Syncing up downstream modifications...")
    push_to_github()
