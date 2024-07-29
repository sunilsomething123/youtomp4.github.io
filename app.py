from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/formats', methods=['POST'])
def get_formats():
    url = request.json.get('url')
    if not url:
        return jsonify({"error": "No URL provided"}), 400

    ydl_opts = {
        'format': 'best',
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            formats = [
                {
                    "url": f['url'],
                    "quality": f"{f['format_id']} - {f['format_note']} - {f['resolution']}"
                } for f in info['formats'] if f['ext'] == 'mp4'
            ]
            return jsonify({"formats": formats})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
