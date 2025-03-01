import tensorflow as tf
import numpy as np
from flask import Flask, request, jsonify
from PIL import Image
import io


app = Flask(__name__)


model = tf.keras.models.load_model("modelama.h5")

labels = [
    "Pisang",
    "Kopi",
    "Jagung",
    "Anggur",
    "Guava",
    "Mangga",
    "Padi",
    "Kentang",
    "Teh",
    "Tembakau",
]


def preprocess_image(image):
    image = image.convert("RGB")
    image = image.resize((126, 126))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image


@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part"})

        file = request.files["file"]
        image = Image.open(io.BytesIO(file.read()))
        input_data = preprocess_image(image)

        prediction = model.predict(input_data)
        predicted_index = np.argmax(prediction)
        predicted_label = labels[predicted_index]

        return jsonify(
            {
                "prediction": predicted_label,
                "confidence": float(prediction[0][predicted_index]),
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(debug=True)
