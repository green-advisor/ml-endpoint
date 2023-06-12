const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

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

// banana 3, kopi 2, potato 6, tobaco 5
// Mendefinisikan fungsi untuk melakukan prediksi gambar menggunakan model
async function predictImage(model, image) {
    const prediction = await model.predict(image);

    const label = ['Banana',
        'Coffee',
        'Corn',
        'Grape',
        'Guava',
        'Mango',
        'Paddy',
        'Potato',
        'Tea',
        'Tobacco']


    const output = prediction.argMax(1).arraySync()[0];
    // const output = prediction.argMax(1);
    return label[output];
}

// Memanggil fungsi untuk memuat model
const modelPath = 'tmp/tfjs_model/model.json';
loadModel(modelPath)
    .then(model => {
        // Memanggil fungsi untuk membaca dan memproses gambar
        const imagePath = 'uji/guava.jpg';
        loadImage(imagePath)
            .then(image => {
                // Memanggil fungsi untuk melakukan prediksi gambar
                predictImage(model, image)
                    .then(output => {
                        console.log('Hasil prediksi:', output);
                    })
                    .catch(err => {
                        console.error('Terjadi kesalahan saat melakukan prediksi:', err);
                    });
            })
            .catch(err => {
                console.error('Terjadi kesalahan saat membaca gambar:', err);
            });
    })
    .catch(err => {
        console.error('Terjadi kesalahan saat memuat model:', err);
    });
