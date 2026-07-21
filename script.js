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

alert(
"PNG枚数："+zipData.images.length
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
