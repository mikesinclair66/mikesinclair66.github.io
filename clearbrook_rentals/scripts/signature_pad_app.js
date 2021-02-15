/*
All credit for this signature pad goes to https://github.com/szimek/signature_pad. It is an open-source project where
the user can create and download their own custom signature. This project provides for a smooth and convenient signature.

Aside from the signature_pad html document and signature_pad scripts, all files were customly created and designed through
Intiva Technologies.
*/

var wrapper = document.getElementById("e-signature1");
var clearButton = wrapper.querySelector("[data-action=clear]");
var undoButton = wrapper.querySelector("[data-action=undo]");
var saveJPGButton = wrapper.querySelector("[data-action=save-jpg]");
var saveJPGButton2 = wrapper.querySelector("[data-action=save-jpg2]");
var canvas = wrapper.querySelector("canvas");
var signaturePad = new SignaturePad(canvas, {
  backgroundColor: 'rgb(255, 255, 255)'
});
var sig1 = signaturePad.toDataURL("image/jpeg"), sig2 = signaturePad.toDataURL("image/jpeg");
var sig1Signed = false, sig2Signed = false;

function resizeCanvas() {
	var ratio =  Math.max(window.devicePixelRatio || 1, 1);
	
	canvas.width = canvas.offsetWidth * ratio;
	canvas.height = canvas.offsetHeight * ratio;
	canvas.getContext("2d").scale(ratio, ratio);
	signaturePad.clear();
}

window.onresize = resizeCanvas;
resizeCanvas();

function upload(dataURL, filename, filler) {
	var blob = dataURLToBlob(dataURL);
	if(filler === "esignature_here")
		sig1 = blob;
	else if(filler === "esignature_here2");
		sig2 = blob;
	
	var signaturePlaceholders = document.getElementsByClassName(filler);
	if(signaturePlaceholders){
		for(el of signaturePlaceholders){
			let url = window.URL.createObjectURL(blob);
			el.src = url;
			el.style.display = "block";
		}
	}
}

function dataURLToBlob(dataURL) {
	var parts = dataURL.split(';base64,');
	var contentType = parts[0].split(":")[1];
	var raw = window.atob(parts[1]);
	var rawLength = raw.length;
	var uInt8Array = new Uint8Array(rawLength);
	
	for (var i = 0; i < rawLength; ++i) {
		uInt8Array[i] = raw.charCodeAt(i);
	}
	
	return new Blob([uInt8Array], { type: contentType });
}

clearButton.addEventListener("click", function (event) {
	signaturePad.clear();
});

undoButton.addEventListener("click", function (event) {
	var data = signaturePad.toData();
	
	if (data) {
	data.pop(); // remove the last dot or line
	signaturePad.fromData(data);
	}
});

saveJPGButton.addEventListener("click", function (event) {
	if (signaturePad.isEmpty()) {
		alert("Please provide a signature first.");
	} else {
		var dataURL = signaturePad.toDataURL("image/jpeg");
		upload(dataURL, "signature.jpg", "esignature_here");
		sig1Signed = true;
	}
});

saveJPGButton2.addEventListener("click", function (event) {
	if (signaturePad.isEmpty()) {
		alert("Please provide a signature first.");
	} else {
		var dataURL = signaturePad.toDataURL("image/jpeg");
		upload(dataURL, "signature.jpg", "esignature_here2");
		sig2Signed = true;
	}
});