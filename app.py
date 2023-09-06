from flask import Flask, render_template, request
import os
import random
import cv2
import base64

app = Flask(__name__, static_url_path='/static')
# image_count = 1

# Function to display random images
def display_images(image_dir, img_count):
    image_files = os.listdir(image_dir)
    randomlist = random.sample(image_files, img_count)
    images = []
    for filename in randomlist:
        img_path = os.path.join(image_dir, filename)
        img = cv2.imread(img_path)
        _, img_encoded = cv2.imencode('.png', img)
        img_base64 = base64.b64encode(img_encoded).decode('utf-8')
        img_obj = {"name": filename, "image": img_base64}
        images.append(img_obj)
    return images

# Custom Jinja2 filter for encoding images as Base64
@app.template_filter('b64encode')
def b64encode_filter(s):
    return base64.b64encode(s.encode()).decode('utf-8')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/display_images')
def display_web_images():
    x_rays_dir = 'x_rays'  # Directory containing your PNG images
    img_count = 5  # Number of random images to display
    images = display_images(x_rays_dir, img_count)
    return render_template('index.html', images=images)

@app.route('/save_descriptions', methods=['POST'])
def save_descriptions():
    descriptions_file_path = os.path.join('data', 'descriptions.txt')
    
    # Get descriptions submitted by the user and log non-empty descriptions
    with open(descriptions_file_path, 'a') as file:
        for key, value in request.form.items():
            if value.strip():  # Check if the description is not empty or contains only whitespace
                file.write(f"{key} - {value}\n")

    return "Descriptions saved successfully."

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5500)
