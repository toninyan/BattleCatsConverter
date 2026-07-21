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

    alert(
        "準備完了！\n\n" +
        "許容値：" +
        tolerance
    );

}
