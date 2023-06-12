const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

const modelbin1 = require('./tmp/tfjs_model/group1-shard1of29.bin');
const modelbin2 = require('./tmp/tfjs_model/group1-shard2of29.bin');
const modelbin3 = require('./tmp/tfjs_model/group1-shard3of29.bin');
const modelbin4 = require('./tmp/tfjs_model/group1-shard4of29.bin');
const modelbin5 = require('./tmp/tfjs_model/group1-shard5of29.bin');
const modelbin6 = require('./tmp/tfjs_model/group1-shard6of29.bin');
const modelbin7 = require('./tmp/tfjs_model/group1-shard7of29.bin');
const modelbin8 = require('./tmp/tfjs_model/group1-shard8of29.bin');
const modelbin9 = require('./tmp/tfjs_model/group1-shard9of29.bin');
const modelbin10 = require('./tmp/tfjs_model/group1-shard10of29.bin');
const modelbin11 = require('./tmp/tfjs_model/group1-shard11of29.bin');
const modelbin12 = require('./tmp/tfjs_model/group1-shard12of29.bin');
const modelbin13 = require('./tmp/tfjs_model/group1-shard13of29.bin');
const modelbin14 = require('./tmp/tfjs_model/group1-shard14of29.bin');
const modelbin15 = require('./tmp/tfjs_model/group1-shard15of29.bin');
const modelbin16 = require('./tmp/tfjs_model/group1-shard16of29.bin');
const modelbin17 = require('./tmp/tfjs_model/group1-shard17of29.bin');
const modelbin18 = require('./tmp/tfjs_model/group1-shard18of29.bin');
const modelbin19 = require('./tmp/tfjs_model/group1-shard19of29.bin');
const modelbin20 = require('./tmp/tfjs_model/group1-shard20of29.bin');
const modelbin21 = require('./tmp/tfjs_model/group1-shard21of29.bin');
const modelbin22 = require('./tmp/tfjs_model/group1-shard22of29.bin');
const modelbin23 = require('./tmp/tfjs_model/group1-shard23of29.bin');
const modelbin24 = require('./tmp/tfjs_model/group1-shard24of29.bin');
const modelbin25 = require('./tmp/tfjs_model/group1-shard25of29.bin');
const modelbin26 = require('./tmp/tfjs_model/group1-shard26of29.bin');
const modelbin27 = require('./tmp/tfjs_model/group1-shard27of29.bin');
const modelbin28 = require('./tmp/tfjs_model/group1-shard28of29.bin');
const modelbin29 = require('./tmp/tfjs_model/group1-shard29of29.bin');


// Mendefinisikan fungsi untuk memuat model dari file JSON
async function loadModel(modelPath) {

    const model = await tf.loadLayersModel('file://' + modelPath);

    const detector = await tf.loadGraphModel(
        bundleResourceIO(modelPath, [
            modelbin1,
            modelbin2,
            modelbin3,
            modelbin4,
            modelbin5,
            modelbin6,
            modelbin7,
            modelbin8,
            modelbin9,
            modelbin10,
            modelbin11,
            modelbin12,
            modelbin13,
            modelbin14,
            modelbin15,
            modelbin16,
            modelbin17,
            modelbin18,
            modelbin19,
            modelbin20,
            modelbin21,
            modelbin22,
            modelbin23,
            modelbin24,
            modelbin25,
            modelbin26,
            modelbin27,
            modelbin28,
            modelbin29,
        ]),
    );

    return detector
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
const modelPath = './tmp/tfjs_model/model.json';
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
