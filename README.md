# Emotional Visualisation through Data-Driven Art

## Context
This project was developed as part of the final assignment for the Generative Art module, where I had the freedom to propose any project of my choice.

## Project Details

### Objective
This project offers introspection by invoking emotional qualities through the transformation of text-based messages into visual art. Participants can witness how their emotions manifest visually, providing a unique perspective on the latent weight that words carry. The system captures subtle shifts in intensity and expression, transforming nuanced variables into a visual narrative that reveals the embedded emotions within each message.

The final work is an interactive online gallery, developed using **HTML, CSS, and JavaScript**, and can be accessed [here](https://jewel-chin.github.io/emotional-visualisation/).

### Survey Experiment
More details can be found in this [repository](https://github.com/jewel-chin/survey-experiment/).

### Generating Visuals

####  Processing Responses
For sentiment analysis, I integrated a **HuggingFace** RoBERTa-base pretrained model using **transformers.js**. 
The responses were processed in **Javascript**, such as number of capitalised words, repetition, and unique character usage etc.

#### Visuals in P5.js
The base visual is inspired by the iconic Rorschach inkblots — a psychological tool that invites viewers to project their own emotions onto
abstract forms. The visuals are developed in **P5.js**, and the processed text variables influence different elements of the visualization. The transition between the visuals were developed in **Javascript**.

#### Interactive Component
Participants can interact with the system by inputting their own responses in real-time. This enables them to witness how their emotions and expressions manifest as unique abstract visuals, creating a dynamic and personalized experience.
