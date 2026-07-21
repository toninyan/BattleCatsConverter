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

alert(

"背景サイズ\n" +

backgroundCanvas.canvas.width +

" × " +

backgroundCanvas.canvas.height

);
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
