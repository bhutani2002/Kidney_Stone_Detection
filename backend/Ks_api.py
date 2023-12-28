# ## FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints.

# # The key features are:
# # Fast: Very high performance, on par with NodeJS and Go (thanks to Starlette and Pydantic). One of the fastest Python frameworks available.
# # Fast to code: Increase the speed to develop features by about 200% to 300%. *
# # Fewer bugs: Reduce about 40% of human (developer) induced errors. *
# # Intuitive: Great editor support. Completion everywhere. Less time debugging.


# ## FastAPI features:

# FastAPI gives you the following:
# Based on open standards
# OpenAPI for API creation, including declarations of path operations, parameters, body requests, security, etc.
# Automatic data model documentation with JSON Schema (as OpenAPI itself is based on JSON Schema).

## OpenApi
# An open API, also called public API, is an application programming interface made publicly available to software developers. Open APIs are published on the internet and shared freely, allowing the owner of a network-accessible service to give a universal access to consumers.

import utils as ut
import uvicorn
from fastapi import FastAPI, File, UploadFile
from starlette.responses import RedirectResponse
import json


app_desc = """<h2>Try this app by uploading any image with `predict/image`</h2>
<h2>Kidney Stone checker api</h2>
<br>by the Team"""
app = FastAPI(title = "Kidney_Stone", description = app_desc)

@app.get('/', include_in_schema = False)
async def index():
    return RedirectResponse(url = '/docs')

@app.post('/predict/image')
async def predict_api(file: UploadFile = File(...)):
    extension = file.filename.split(".")[-1].lower() in ("jpg","jpeg","png")
    if not extension:
        return "Image must be jpg, jpeg or png format!"
    image = ut.read_imagefile(await file.read())
    prediction = ut.predict(image)
    
    prediction = prediction[0][0]
    temp = (float)(prediction) * 100
    print(temp)
    json_data = {}
    if (temp > 40):
        json_data['Message'] = 1
    else:
        json_data['Message'] = 0
    print(prediction)
    prediction = prediction.tolist()
    prediction = json.dumps(prediction)
    prediction = (float)("{:.2f}".format((float)(prediction) * 100))
    json_data['Probability'] = prediction 
    return json_data

@app.get('/api')
async def root():
    return {"message" : "Frontend is calling me!"}


#MLIR: Multi-Level Intermediate Representation 


if __name__ == "__main__":
    uvicorn.run(app)