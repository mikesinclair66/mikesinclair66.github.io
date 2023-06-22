/*MIT License

Copyright (c) 2019 Andrew Dillon

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.*/

const {PDFDocument, StandardFonts, rgb} = PDFLib;
const urls = [
	'https://lothianaviationinc.ca/COVID-19-Protocols.pdf',
	'https://lothianaviationinc.ca/Post-Secondary-BC-Guideline1.pdf'
];

/*document.getElementById("download_covid19").onclick = async (e) => {
	e.preventDefault();
	const covidDoc = await getPdf(0);
	
	
	window.open(covidDoc.doc);
};

document.getElementById("download_bc_guideline").onclick = async (e) => {
	e.preventDefault();
	const bytes = await getPdf(1).bytes;
	window.open(window.createObjectURL(bytes));
};*/

const docLinks = [
	document.getElementById("download_covid19_link"),
	document.getElementById("download_bc_guideline_link")
];
async function processPdfs(){
	for(let i = 0; i < 2; i++){
		let pdfBytes = await fetch(urls[i]).then(res => res.arrayBuffer());
		let pdfDoc = await PDFDocument.load(pdfBytes);
		let pages = pdfDoc.getPages();
		
		if(i === 0){
			const blankSpotBytes = await fetch("https://lothianaviationinc.ca/images/blank_spot.jpg").then((res) => res.arrayBuffer());
			const blankSpot = await pdfDoc.embedJpg(blankSpotBytes);
			const logoBytes = await fetch("https://lothianaviationinc.ca/images/logo/logo_standard.png").then((res) => res.arrayBuffer());
			const logoImg = await pdfDoc.embedPng(logoBytes);
			
			for(let i = 0; i < pages.length; i++){
				let curPage = pages[i];
				
				curPage.drawImage(blankSpot, {
					x: curPage.getWidth() * 0.05,
					y: curPage.getHeight() * 0.89,
					width: blankSpot.scale(4).width,
					height: blankSpot.scale(0.5).height
				});
				
				curPage.drawImage(blankSpot, {
					x: curPage.getWidth() * 0.05,
					y: curPage.getHeight() * 0.019,
					width: blankSpot.scale(4).width,
					height: blankSpot.scale(0.5).height
				});
				
				curPage.drawText("Phone: 778-871-3341", {x: curPage.getWidth() * 0.2, y: curPage.getHeight() * 0.02, size: 13});
				curPage.drawText("E: lothian.ber@gmail.com", {x: curPage.getWidth() * 0.6, y: curPage.getHeight() * 0.02, size: 13});
				
				const pngDims = logoImg.scale(0.15);
				curPage.drawImage(logoImg, {
					x: curPage.getWidth() * 0.1,
					y: curPage.getHeight() * 0.825,
					width: pngDims.width,
					height: pngDims.height
				});
			}
			
			pdfBytes = await pdfDoc.save();
		}
		
		let blob = new Blob([pdfBytes], {type: 'application/pdf'});
		let url = window.URL.createObjectURL(blob);
		
		docLinks[i].href = url;
		docLinks[i].setAttribute("download", ((i === 0) ? "COVID-19-Protocols" : "Post-Secondary-BC-Guideline1"));
	}
}
processPdfs();