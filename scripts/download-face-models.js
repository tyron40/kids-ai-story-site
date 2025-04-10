const fs = require('fs');
const path = require('path');
const https = require('https');

const MODELS_DIR = path.join(process.cwd(), 'public', 'models');
const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

const MODELS = [
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_expression_model-weights_manifest.json',
  'face_expression_model-shard1',
  'age_gender_model-weights_manifest.json',
  'age_gender_model-shard1'
];

if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
}

function downloadFile(filename) {
  const url = `${BASE_URL}/${filename}`;
  const filePath = path.join(MODELS_DIR, filename);

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filePath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${filename}`);
          resolve();
        });
      } else {
        reject(`Failed to download ${filename}: ${response.statusCode}`);
      }
    }).on('error', (err) => {
      reject(`Error downloading ${filename}: ${err.message}`);
    });
  });
}

async function downloadModels() {
  try {
    await Promise.all(MODELS.map(model => downloadFile(model)));
    console.log('All models downloaded successfully');
  } catch (error) {
    console.error('Error downloading models:', error);
    process.exit(1);
  }
}

downloadModels();
