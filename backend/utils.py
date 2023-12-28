from io import BytesIO
import numpy as np
import tensorflow as tf
from PIL import Image
# from tensorflow.keras.applications.imagenet_utils import decode_predictions
from tensorflow.keras.models import load_model
import matplotlib.pyplot as plt
import cv2
# from keras.preprocessing import image
model = None

def load_model_cust():
    model = load_model('kidney_stone_detection_model.h5', compile=False)
    print("Model Loaded")
    return model

IMAGE_SIZE = (128, 128, 3)

# def predict(image1: Image.Image):
#     global model
#     if model is None:
#         model = load_model_cust()

#     image1 = image1.resize((128,128)) # size(x,y) -> size(128,128)
#     image1 = np.expand_dims(image1, axis=0) # dimensions(128,128) -> dimensions(1,128,128)
#     image1 = np.expand_dims(image1, axis = -1) # dimensions(1, 128, 128) -> dimensions(1, 128, 128, 1)
#     image1 = np.tile(image1, (1,1,1,3)) # dimensions(1, 128, 128 ,1) -> dimensions(1, 128, 128, 3)


#     # Make prediction
#     result = model.predict(image1)
#     return result

def predict(image1: Image.Image):
    global model
    if model is None:
        model = load_model_cust()

    # Resize the image
    image1 = image1.resize((128, 128))

    # Convert image to NumPy array
    image_array = np.asarray(image1)

    # Check if the image has 1 channel (grayscale)
    if image_array.ndim == 2:
        # Convert grayscale to 3 channels
        image_array = np.repeat(np.expand_dims(image_array, axis=-1), 3, axis=-1)

    # Add batch dimension
    image_array = np.expand_dims(image_array, axis=0)

    # Make prediction
    result = model.predict(image_array)
    return result

def read_imagefile(file) -> Image.Image:
    image = Image.open(BytesIO(file))
    return image