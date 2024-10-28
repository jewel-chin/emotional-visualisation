import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers";
env.allowLocalModels = false;

const text_input = document.getElementById("text_input");
console.log(text_input);
// const pipe = await pipeline('text-classification', 'Xenova/twitter-roberta-base-sentiment-latest');
text_input.addEventListener('input', function (e) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }
    console.log(e)
}
)
