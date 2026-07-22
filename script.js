document
.getElementById("convert")
.onclick = convert;

async function convert(){

    const backgroundFile =
    document
    .getElementById("backgroundFile")
    .files[0];

    const zipFile =
    document
    .getElementById("zipFile")
    .files[0];

    const tolerance =
    Number(
        document
        .getElementById("tolerance")
        .value
    );

    if(!backgroundFile){

        alert("背景画像を選択してください");

        return;

    }

    if(!zipFile){

        alert("ZIPを選択してください");

        return;

    }

    const zipData =
await loadZip(zipFile);

const backgroundImage =
await loadImage(backgroundFile);

const backgroundCanvas =
imageToCanvas(backgroundImage);

const newZip = new JSZip();

for(const imageName of zipData.images){

    const imageBlob =
    await zipData.zip
    .file(imageName)
    .async("blob");

    const resultCanvas =
    await processImage(
        imageBlob,
        backgroundCanvas,
        tolerance
    );

    const pngBlob =
    await saveCanvasAsBlob(resultCanvas);

    newZip.file(
        imageName,
        pngBlob
    );

}
    await downloadZip(

    newZip,

    "background_removed_" +
    zipFile.name

);

alert("完成！");
}
async function loadZip(file){

    // ZIPを読み込む
    const zip = await JSZip.loadAsync(file);

    // PNG一覧
    const images = [];

    for(const name in zip.files){

        if(name.toLowerCase().endsWith(".png")){

            images.push(name);

        }

    }

    // 数字順
    images.sort((a,b)=>{

        const numA =
        parseInt(
            a.match(/\d+(?=\.[^.]+$)/)[0]
        );

        const numB =
        parseInt(
            b.match(/\d+(?=\.[^.]+$)/)[0]
        );

        return numA-numB;

    });

    return {

        zip,
        images

    };

}
async function loadImage(file){

    return new Promise((resolve,reject)=>{

        const img = new Image();

        img.onload = ()=>{

            resolve(img);

        };

        img.onerror = ()=>{

            reject("画像を読み込めませんでした");

        };

        img.src = URL.createObjectURL(file);

    });

}

function imageToCanvas(image){

    const canvas = document.createElement("canvas");

    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(image,0,0);

    return {

        canvas,
        ctx,
        imageData: ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        )

    };

}
async function processImage(file, backgroundCanvas, tolerance){

    // キャラ画像を読み込む
    const image = await loadImage(file);

    // Canvas化
    const catCanvas = imageToCanvas(image);

    const bgData =
    backgroundCanvas.imageData.data;

    const catData =
    catCanvas.imageData.data;

    // 全ピクセル比較
    for(let i=0;i<catData.length;i+=4){
const dr = Math.abs(catData[i] - bgData[i]);
const dg = Math.abs(catData[i+1] - bgData[i+1]);
const db = Math.abs(catData[i+2] - bgData[i+2]);

if (
    dr <= tolerance &&
    dg <= tolerance &&
    db <= tolerance
){

    catData[i+3] = 0;

}

    }

    // Canvasへ戻す
    catCanvas.ctx.putImageData(
        catCanvas.imageData,
        0,
        0
    );

    return catCanvas.canvas;

}
async function saveCanvasAsBlob(canvas){

    return new Promise((resolve)=>{

        canvas.toBlob((blob)=>{

            resolve(blob);

        },"image/png");

    });

}
async function downloadZip(zip,fileName){

    const blob =
    await zip.generateAsync({

        type:"blob"

    });

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download = fileName;

    a.click();

    URL.revokeObjectURL(url);

}
