const fastify = require('fastify');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

const app = fastify();
const port = 3000;

// Mendefinisikan fungsi untuk memuat model dari file JSON
async function loadModel(modelPath) {
    const model = await tf.loadLayersModel('file://' + modelPath);
    return model;
}

// Mendefinisikan fungsi untuk membaca gambar sebagai Tensor
async function loadImage(imagePath) {
    const imageBuffer = fs.readFileSync(imagePath);
    const tfimage = tf.node.decodeImage(imageBuffer);

    // Mengubah ukuran gambar menjadi 128x128
    const resizedImage = tf.image.resizeBilinear(tfimage, [128, 128]);

    const expandedImage = resizedImage.expandDims(0);
    return expandedImage;
}

// Mendefinisikan fungsi untuk melakukan prediksi gambar menggunakan model
async function predictImage(model, image) {
    const prediction = await model.predict(image);
    const output = prediction.argMax(1).arraySync()[0];
    // const output = prediction.dataSync();
    return output;
}

app.get('/', async (request, reply) => {
    return { hello: 'world' }
})


// Endpoint untuk prediksi gambar
app.post('/predict', async (req, res) => {
    const imagePath = 'url gambar';

    try {
        // Memuat model
        const modelPath = 'tmp/tfjs_model/model.json';
        const model = await loadModel(modelPath);

        // Membaca dan memproses gambar
        const image = await loadImage(imagePath);

        // Melakukan prediksi gambar
        const output = await predictImage(model, image);

        // Mengirimkan hasil prediksi sebagai respons
        res.send({ prediction: output });
    } catch (err) {
        console.error('Terjadi kesalahan:', err);
        res.status(500).send({ error: 'Terjadi kesalahan saat memproses permintaan' });
    }
});

// Menjalankan server pada port yang ditentukan
app.listen(port, (err) => {
    if (err) {
        console.error('Terjadi kesalahan:', err);
        process.exit(1);
    }
    console.log(`Server berjalan di http://localhost:${port}`);
});
