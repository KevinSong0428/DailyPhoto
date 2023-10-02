import json
import requests
from io import BytesIO
from PIL import Image
from sklearn.cluster import KMeans
import numpy as np
import matplotlib.pyplot as plt
import sys


def processPhoto(photo):
    response = requests.get(photo)

    # using KMeans
    image = Image.open(BytesIO(response.content))
    # convert image to numpy array
    image_np = np.array(image)

    # reshape image to a flattened list of pixels
    pixels = image_np.reshape(-1, 3)

    # set random state to always get same color palette even if same picture is uploaded.
    kmeans = KMeans(n_clusters=5, n_init="auto", random_state=101)
    kmeans.fit(pixels)

    dominant_color = kmeans.cluster_centers_.astype(int)
    palette = []
    for color in dominant_color:
        # print(tuple(color))
        hex = f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}"
        # print(hex)
        palette.append(hex)

    # plt.imshow([[dominant_color[i] for i in range(5)]])
    # plt.show()
    # print(dominant_color)
    # print(palette)

    # converts the array to a JSON string
    result = json.dumps(palette)

    # need to print in order to get in app.js
    print(result)


url = sys.argv[1]
processPhoto(url)
