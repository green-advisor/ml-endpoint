const fastify = require('fastify');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');

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


async function downloadImage(url, filePath) {
    try {
        const response = await fetch(url);
        const buffer = await response.buffer();
        fs.writeFileSync(filePath, buffer);
        console.log('Image downloaded successfully.');
    } catch (error) {
        console.error(`Error downloading the image: ${error}`);
        throw error;
    }
}

// Mendefinisikan fungsi untuk melakukan prediksi gambar menggunakan model
async function predictImage(model, image) {
    const prediction = await model.predict(image);
    const output = prediction.argMax(1).arraySync()[0];
    return output;
}



const folderPath = 'tmp/gambar';
const deleteInterval = 1; // Waktu dalam menit

function deleteFilesInFolder() {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Gagal membaca isi folder:', err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(folderPath, file);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Gagal menghapus file:', filePath, err);
                    return;
                }
                console.log('File dihapus:', filePath);
            });
        });
    });
}

app.get('/', async (request, reply) => {
    return { hello: 'world' }
})


// Endpoint untuk prediksi gambar
app.get('/predict', async (req, res) => {


    let imageurl = req.query.imageurl;
    let imagename = req.query.imagename;
    let imagePath = `tmp/gambar/${imagename}.jpg`

    try {
        downloadImage(imageurl, imagePath)

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
        console.error('Terjadi kesalahan: ulangi pemotretan');
        res.status(500).send({ error: 'Terjadi kesalahan saat memproses permintaan' });
    }
});

// Menjalankan server pada port yang ditentukan
app.listen(port, '0.0.0.0', (err, addres) => {
    if (err) {
        console.error('Terjadi kesalahan:', err);
        process.exit(1);
    }
    setInterval(deleteFilesInFolder, deleteInterval * 60 * 1000);
    console.log(`Server berjalan di ${addres}`);
});
