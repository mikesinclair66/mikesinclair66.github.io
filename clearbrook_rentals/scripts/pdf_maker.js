const WIDTH = 595, HEIGHT = 842;
const ROW = 0.02125 * HEIGHT, ROWTHIRD = ROW * 0.49;//row ratio to height of page
var checkboxImg = null, checkboxDims = null;
//vertical constants
const B = HEIGHT / 2 + 13, C = HEIGHT / 2 - 104, D = HEIGHT / 2 - HEIGHT / 5 - 35, F = HEIGHT / 10 + 3,
	H = HEIGHT * 0.836, I = HEIGHT / 2 + ROW * 0.25, J = HEIGHT * 0.175, K = HEIGHT / 8 - ROW * 1.2;
//horizontal constants - second page
const STARTX = WIDTH / 20, MID = WIDTH / 2, END = WIDTH - STARTX,
	LAST_NAME = STARTX * 1.9, FIRST_NAME = LAST_NAME * 2.925, MIDDLE_NAME = LAST_NAME * 4.975, DOB = MID + STARTX * 2.2,
	SIN = WIDTH * 3 / 4 - STARTX * 0.28, CITY1 = MID - STARTX * 1.15, POSTAL1 = MID + STARTX * 1.8, PRIMARY_PHONE = SIN + STARTX  * 0.35, 
	RADIO2 = STARTX * 2, OCCUPANCY = STARTX * 2.95, LEAVE_REASON = WIDTH / 4 + STARTX * 1.45, RENT = SIN + RADIO2 * 0.9,
	CITY2 = MID + RADIO2 * 1.55, POSTAL2 = WIDTH * 3 / 4 + STARTX * 1.25, PETS_DESC = DOB - STARTX * 1.2;
//horizontal constants - third page
const CELL_NO = FIRST_NAME + STARTX * 0.14, FAX_NO = DOB - STARTX * 1.8,
	ADDRESS = CITY1 + STARTX * 0.125, MODEL = LEAVE_REASON + STARTX * 0.27, COLOUR = POSTAL1 - STARTX * 0.3, LICENSE = POSTAL2 - STARTX * 0.225,
	LAST_NAME2 = MID + LAST_NAME - STARTX * 0.625, FIRST_NAME2 = MID + FIRST_NAME - STARTX * 0.625, MIDDLE_NAME2 = MID + MIDDLE_NAME - STARTX * 0.625;

const { PDFDocument, StandardFonts } = PDFLib;
var blob;

//y-d-m to m-d-y
function processDate(val){
	let values = val.split("-");
	return values[2] + "-" + values[1] + "-" + values[0];
}

function writeText(page, textFont, text, textX, textY){
	page.drawText(text, {
		x: textX,
		y: textY,
		size: 10,
		font: textFont
	});
}

function drawRadio(page, btn, imgX, imgY){
	if(btn.checked){
		page.drawImage(checkboxImg, {
			x: imgX,
			y: imgY,
			width: checkboxDims.width,
			height: checkboxDims.height
		});
	}
}

async function modifyPage(page2, page3, font){
	//B
	//name
	writeText(page2, font, document.getElementById("applicant_lastname").value, LAST_NAME, B);
	writeText(page2, font, document.getElementById("applicant_firstname").value, FIRST_NAME, B);
	writeText(page2, font, document.getElementById("applicant_middlename").value, MIDDLE_NAME, B);
	//dob
	//TODO separate date columns and paste to pdf
	writeText(page2, font, processDate(document.getElementById("applicant_birthdate").value), DOB, B + 9);
	//sin
	writeText(page2, font, document.getElementById("applicant_sin").value, SIN, B);
	//presentproperty
	writeText(page2, font, document.getElementById("applicant_address").value, STARTX, B - ROW);
	writeText(page2, font, document.getElementById("applicant_city").value, CITY1, B - ROW);
	writeText(page2, font, document.getElementById("applicant_postal").value, POSTAL1, B - ROW);
	writeText(page2, font, document.getElementById("applicant_phone").value, PRIMARY_PHONE, B - ROW);
	writeText(page2, font, document.getElementById("occupancy").value, OCCUPANCY, B - ROW * 2);
	writeText(page2, font, document.getElementById("leave_reason").value, LEAVE_REASON, B - ROW * 2);
	writeText(page2, font, document.getElementById("current_rate").value, RENT, B - ROW * 2);
	//previousproperty
	writeText(page2, font, document.getElementById("applicant_address_previous").value, STARTX, B - ROW * 3);
	writeText(page2, font, document.getElementById("applicant_city_previous").value, CITY2, B - ROW * 3);
	writeText(page2, font, document.getElementById("applicant_postal_previous").value, POSTAL2, B - ROW * 3);
	writeText(page2, font, document.getElementById("occupancy_previous").value, OCCUPANCY, B - ROW * 4);
	writeText(page2, font, document.getElementById("leave_reason2").value, LEAVE_REASON, B - ROW * 4);
	writeText(page2, font, document.getElementById("current_rate_previous").value, RENT, B - ROW * 4);
	
	//C
	//TODO write only where different from previous
	//name
	writeText(page2, font, document.getElementById("coapplicant_lastname").value, LAST_NAME, C);
	writeText(page2, font, document.getElementById("coapplicant_firstname").value, FIRST_NAME, C);
	writeText(page2, font, document.getElementById("coapplicant_middlename").value, MIDDLE_NAME, C);
	//dob
	//TODO separate date columns and paste to pdf
	writeText(page2, font, processDate(document.getElementById("coapplicant_birthdate").value), DOB, C + 9);
	//writeText(page, font, document.getElementById("").value, , );//DAY
	//writeText(page, font, document.getElementById("").value, , );//YEAR
	//sin
	writeText(page2, font, document.getElementById("coapplicant_sin").value, SIN, C);
	//presentproperty
	writeText(page2, font, document.getElementById("coapplicant_address").value, STARTX, C - ROW);
	writeText(page2, font, document.getElementById("coapplicant_city").value, CITY1, C - ROW);
	writeText(page2, font, document.getElementById("coapplicant_postal").value, POSTAL1, C - ROW);
	writeText(page2, font, document.getElementById("coapplicant_phone").value, PRIMARY_PHONE, C - ROW);
	writeText(page2, font, document.getElementById("cooccupancy").value, OCCUPANCY, C - ROW * 2);
	writeText(page2, font, document.getElementById("coleave_reason").value, LEAVE_REASON, C - ROW * 2);
	writeText(page2, font, document.getElementById("cocurrent_rate").value, RENT, C - ROW * 2);
	//previousproperty
	writeText(page2, font, document.getElementById("coapplicant_address_previous").value, STARTX, C - ROW * 3);
	writeText(page2, font, document.getElementById("coapplicant_city_previous").value, CITY2, C - ROW * 3);
	writeText(page2, font, document.getElementById("coapplicant_postal_previous").value, POSTAL2, C - ROW * 3);
	writeText(page2, font, document.getElementById("cooccupancy_previous").value, OCCUPANCY, C - ROW * 4);
	writeText(page2, font, document.getElementById("coleave_reason2").value, LEAVE_REASON, C - ROW * 4);
	writeText(page2, font, document.getElementById("cocurrent_rate_previous").value, RENT, C - ROW * 4);
	
	//D
	writeText(page2, font, document.getElementById("pets_desc").value, PETS_DESC, D);
	
	//F
	//blob for primary signature
	writeText(page2, font, document.getElementById("sign_date").value, LEAVE_REASON + STARTX * 0.725, F);
	//blob for secondary signature
	writeText(page2, font, document.getElementById("sign_date").value, RENT, F);
	
	//H
	writeText(page3, font, document.getElementById("second_phone").value, STARTX, H);
	writeText(page3, font, document.getElementById("cellphone").value, CELL_NO, H);
	writeText(page3, font, document.getElementById("fax_no").value, FAX_NO, H);
	writeText(page3, font, document.getElementById("work_phone").value, PRIMARY_PHONE, H);
	writeText(page3, font, document.getElementById("email").value, STARTX, H - ROW);
	writeText(page3, font, document.getElementById("landlord_current").value, STARTX, H - ROW * 2);
	writeText(page3, font, document.getElementById("landlord_current_address").value, ADDRESS, H - ROW * 2);
	writeText(page3, font, document.getElementById("landlord_current_phone").value, POSTAL2, H - ROW * 2);
	writeText(page3, font, document.getElementById("landlord_previous").value, STARTX, H - ROW * 3);
	writeText(page3, font, document.getElementById("landlord_previous_address").value, ADDRESS, H - ROW * 3);
	writeText(page3, font, document.getElementById("landlord_previous_phone").value, POSTAL2, H - ROW * 3);
	writeText(page3, font, document.getElementById("employer").value, STARTX, H - ROW * 4);
	writeText(page3, font, document.getElementById("job").value, ADDRESS, H - ROW * 4);
	writeText(page3, font, document.getElementById("monthly_income").value, POSTAL2, H - ROW * 4);
	writeText(page3, font, document.getElementById("supervisor").value, STARTX, H - ROW * 5);
	writeText(page3, font, document.getElementById("supervisor_phone").value, ADDRESS, H - ROW * 5);
	writeText(page3, font, document.getElementById("employment_length").value, POSTAL2, H - ROW * 5);
	writeText(page3, font, document.getElementById("employer_previous").value, STARTX, H - ROW * 6);
	writeText(page3, font, document.getElementById("job_previous").value, ADDRESS, H - ROW * 6);
	writeText(page3, font, document.getElementById("monthly_income_previous").value, POSTAL2, H - ROW * 6);
	writeText(page3, font, document.getElementById("supervisor_previous").value, STARTX, H - ROW * 7);
	writeText(page3, font, document.getElementById("supervisor_phone_previous").value, ADDRESS, H - ROW * 7);
	writeText(page3, font, document.getElementById("employment_length_previous").value, POSTAL2, H - ROW * 7);
	//vehiclesec
	writeText(page3, font, document.getElementById("vehicle_make").value, STARTX, H - ROW * 8);
	writeText(page3, font, document.getElementById("model").value, MODEL, H - ROW * 8);
	writeText(page3, font, document.getElementById("vehicle_color").value, COLOUR, H - ROW * 8);
	writeText(page3, font, document.getElementById("license_no").value, LICENSE, H - ROW * 8);
	writeText(page3, font, document.getElementById("vehicle_make_previous").value, STARTX, H - ROW * 9);
	writeText(page3, font, document.getElementById("model_previous").value, MODEL, H - ROW * 9);
	writeText(page3, font, document.getElementById("vehicle_color_previous").value, COLOUR, H - ROW * 9);
	writeText(page3, font, document.getElementById("license_no_previous").value, LICENSE, H - ROW * 9);
	//refsec
	writeText(page3, font, document.getElementById("ref_name").value, STARTX, H - ROW * 10 - ROWTHIRD);
	writeText(page3, font, document.getElementById("ref_address").value, ADDRESS, H - ROW * 10 - ROWTHIRD);
	writeText(page3, font, document.getElementById("ref_phone").value, POSTAL2, H - ROW * 10 - ROWTHIRD);
	//emergencysec
	writeText(page3, font, document.getElementById("emergency_name").value, STARTX, H - ROW * 11 - ROWTHIRD * 2);
	writeText(page3, font, document.getElementById("emergency_address").value, ADDRESS, H - ROW * 11 - ROWTHIRD * 2);
	writeText(page3, font, document.getElementById("emergency_phone").value, POSTAL2, H - ROW * 11 - ROWTHIRD * 2);
	writeText(page3, font, document.getElementById("emergency_name2").value, STARTX, H - ROW * 12 - ROWTHIRD * 2);
	writeText(page3, font, document.getElementById("emergency_address2").value, ADDRESS, H - ROW * 12 - ROWTHIRD * 2);
	writeText(page3, font, document.getElementById("emergency_phone").value, POSTAL2, H - ROW * 12 - ROWTHIRD * 2);
	
	//I
	writeText(page3, font, document.getElementById("cosecond_phone").value, STARTX, I);
	writeText(page3, font, document.getElementById("cocellphone").value, CELL_NO, I);
	writeText(page3, font, document.getElementById("cofax_no").value, FAX_NO, I);
	writeText(page3, font, document.getElementById("cowork_phone").value, PRIMARY_PHONE, I);
	writeText(page3, font, document.getElementById("coemail").value, STARTX, I - ROW);                                    
	writeText(page3, font, document.getElementById("colandlord_current").value, STARTX, I - ROW * 2);
	writeText(page3, font, document.getElementById("colandlord_current_address").value, ADDRESS, I - ROW * 2);
	writeText(page3, font, document.getElementById("colandlord_current_phone").value, POSTAL2, I - ROW * 2);
	writeText(page3, font, document.getElementById("colandlord_previous").value, STARTX, I - ROW * 3);
	writeText(page3, font, document.getElementById("colandlord_previous_address").value, ADDRESS, I - ROW * 3);
	writeText(page3, font, document.getElementById("colandlord_previous_phone").value, POSTAL2, I - ROW * 3);
	writeText(page3, font, document.getElementById("coemployer").value, STARTX, I - ROW * 4);
	writeText(page3, font, document.getElementById("cojob").value, ADDRESS, I - ROW * 4);
	writeText(page3, font, document.getElementById("comonthly_income").value, POSTAL2, I - ROW * 4);
	writeText(page3, font, document.getElementById("cosupervisor").value, STARTX, I - ROW * 5);
	writeText(page3, font, document.getElementById("cosupervisor_phone").value, ADDRESS, I - ROW * 5);
	writeText(page3, font, document.getElementById("coemployment_length").value, POSTAL2, I - ROW * 5);
	writeText(page3, font, document.getElementById("coemployer_previous").value, STARTX, I - ROW * 6);
	writeText(page3, font, document.getElementById("cojob_previous").value, ADDRESS, I - ROW * 6);
	writeText(page3, font, document.getElementById("comonthly_income_previous").value, POSTAL2, I - ROW * 6);
	writeText(page3, font, document.getElementById("cosupervisor_previous").value, STARTX, I - ROW * 7);
	writeText(page3, font, document.getElementById("cosupervisor_phone_previous").value, ADDRESS, I - ROW * 7);
	writeText(page3, font, document.getElementById("coemployment_length_previous").value, POSTAL2, I - ROW * 7);
	//vehiclesec                                    
	writeText(page3, font, document.getElementById("covehicle_make").value, STARTX, I - ROW * 8);
	writeText(page3, font, document.getElementById("comodel").value, MODEL, I - ROW * 8);
	writeText(page3, font, document.getElementById("covehicle_color").value, COLOUR, I - ROW * 8);
	writeText(page3, font, document.getElementById("colicense_no").value, LICENSE, I - ROW * 8);
	writeText(page3, font, document.getElementById("covehicle_make_previous").value, STARTX, I - ROW * 9);
	writeText(page3, font, document.getElementById("comodel_previous").value, MODEL, I - ROW * 9);
	writeText(page3, font, document.getElementById("covehicle_color_previous").value, COLOUR, I - ROW * 9);
	writeText(page3, font, document.getElementById("colicense_no_previous").value, LICENSE, I - ROW * 9);
	//refsec                                        
	writeText(page3, font, document.getElementById("coref_name").value, STARTX, I - ROW * 10 - ROWTHIRD);
	writeText(page3, font, document.getElementById("coref_address").value, ADDRESS, I - ROW * 10 - ROWTHIRD);
	writeText(page3, font, document.getElementById("coref_phone").value, POSTAL2, I - ROW * 10 - ROWTHIRD);
	//emergencysec                                  
	writeText(page3, font, document.getElementById("coemergency_name").value, STARTX, I - ROW * 11 - ROWTHIRD * 2);
	writeText(page3, font, document.getElementById("coemergency_address").value, ADDRESS, I - ROW * 11 - ROWTHIRD * 2);
	writeText(page3, font, document.getElementById("coemergency_phone").value, POSTAL2, I - ROW * 11 - ROWTHIRD * 2);
	writeText(page3, font, document.getElementById("coemergency_name2").value, STARTX, I - ROW * 12 - ROWTHIRD * 2);
	writeText(page3, font, document.getElementById("coemergency_address2").value, ADDRESS, I - ROW * 12 - ROWTHIRD * 2);
	writeText(page3, font, document.getElementById("coemergency_phone").value, POSTAL2, I - ROW * 12 - ROWTHIRD * 2);
	
	//J
	writeText(page3, font, document.getElementById("adult1_last").value, LAST_NAME, J);
	writeText(page3, font, document.getElementById("adult1_first").value, FIRST_NAME, J);
	writeText(page3, font, document.getElementById("adult1_middle").value, MIDDLE_NAME - STARTX * 1.25, J + STARTX * 0.2);
	writeText(page3, font, document.getElementById("adult2_last").value, LAST_NAME2, J);
	writeText(page3, font, document.getElementById("adult2_first").value, FIRST_NAME2, J);
	writeText(page3, font, document.getElementById("adult2_middle").value, MIDDLE_NAME2 - STARTX * 1.25, J + STARTX * 0.2);
	writeText(page3, font, document.getElementById("adult3_last").value, LAST_NAME, J - ROW);
	writeText(page3, font, document.getElementById("adult3_first").value, FIRST_NAME, J - ROW);
	writeText(page3, font, document.getElementById("adult3_middle").value, MIDDLE_NAME - STARTX * 1.25, J - ROW + STARTX * 0.2);
	writeText(page3, font, document.getElementById("adult4_last").value, LAST_NAME2, J - ROW);
	writeText(page3, font, document.getElementById("adult4_first").value, FIRST_NAME2, J - ROW);
	writeText(page3, font, document.getElementById("adult4_middle").value, MIDDLE_NAME2 - STARTX * 1.25, J - ROW + STARTX * 0.2);
	
	//K
	writeText(page3, font, document.getElementById("kid1_last").value, LAST_NAME, K);
	writeText(page3, font, document.getElementById("kid1_first").value, FIRST_NAME, K);
	writeText(page3, font, document.getElementById("kid1_middle").value, MIDDLE_NAME - STARTX * 1.25, K + STARTX * 0.2);
	writeText(page3, font, document.getElementById("kid2_last").value, LAST_NAME2, K);
	writeText(page3, font, document.getElementById("kid2_first").value, FIRST_NAME2, K);
	writeText(page3, font, document.getElementById("kid2_middle").value, MIDDLE_NAME2 - STARTX * 1.25, K + STARTX * 0.2);
	writeText(page3, font, document.getElementById("kid3_last").value, LAST_NAME, K - ROW);
	writeText(page3, font, document.getElementById("kid3_first").value, FIRST_NAME, K - ROW);
	writeText(page3, font, document.getElementById("kid3_middle").value, MIDDLE_NAME - STARTX * 1.25, K - ROW + STARTX * 0.2);
	writeText(page3, font, document.getElementById("kid4_last").value, LAST_NAME2, K - ROW);
	writeText(page3, font, document.getElementById("kid4_first").value, FIRST_NAME2, K - ROW);
	writeText(page3, font, document.getElementById("kid4_middle").value, MIDDLE_NAME2 - STARTX * 1.25, K - ROW + STARTX * 0.2);
}

async function copyPages() {
	const applicationBytes = await fetch("https://clearbrookrentals.ca/fillable_application.pdf").then(res => res.arrayBuffer());
	const checkboxBlob = await fetch("https://clearbrookrentals.ca/images/checkmark.png").then(res => res.arrayBuffer());

	// Load a PDFDocument from each of the existing PDFs
	const applicationPdfDoc = await PDFDocument.load(applicationBytes);
	
	// Create a new PDFDocument
	const pdfDoc = await PDFDocument.create();
	const tnrFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
	
	const [page1] = await pdfDoc.copyPages(applicationPdfDoc, [0]);
	const [page2] = await pdfDoc.copyPages(applicationPdfDoc, [1]);
	const [page3] = await pdfDoc.copyPages(applicationPdfDoc, [2]);
	
	await modifyPage(page2, page3, tnrFont);
	
	//apply signature blobs and checkbox blob
	const sig1Array = await new Response(sig1).arrayBuffer();
	const sig1Img = await pdfDoc.embedJpg(sig1Array);
	const sig1Dims = sig1Img.scale(0.06);
	page2.drawImage(sig1Img, {
		x: LEAVE_REASON - STARTX * 3.75,
		y: F - ROW,
		width: sig1Dims.width,
		height: sig1Dims.height
	});
	const sig2Array = await new Response(sig2).arrayBuffer();
	const sig2Img = await pdfDoc.embedJpg(sig2Array);
	const sig2Dims = sig2Img.scale(0.06);
	page2.drawImage(sig2Img, {
		x: RENT - STARTX * 4.5,
		y: F - ROW,
		width: sig2Dims.width,
		height: sig2Dims.height
	});
	//checkboxes
	checkboxImg = await pdfDoc.embedPng(checkboxBlob);
	checkboxDims = checkboxImg.scale(0.1);
	//B
	drawRadio(page2, document.getElementById("rent1"), STARTX * 1.25, B - ROW * 2);
	drawRadio(page2, document.getElementById("rent2"), STARTX * 2.275, B - ROW * 2);
	drawRadio(page2, document.getElementById("rent_previous1"), STARTX * 1.25, B - ROW * 4);
	drawRadio(page2, document.getElementById("rent_previous2"), STARTX * 2.28, B - ROW * 4);
	//C
	drawRadio(page2, document.getElementById("corent1"), STARTX * 1.25, C - ROW * 2);
	drawRadio(page2, document.getElementById("corent2"), STARTX * 2.28, C - ROW * 2);
	drawRadio(page2, document.getElementById("corent_previous1"), STARTX * 1.25, C - ROW * 4);
	drawRadio(page2, document.getElementById("corent_previous2"), STARTX * 2.28, C - ROW * 4);
	//D
	drawRadio(page2, document.getElementById("no_pets"), OCCUPANCY + STARTX * 1.2, D - ROW * 0.1);
	drawRadio(page2, document.getElementById("yes_pets"), LEAVE_REASON + STARTX * 0.8, D - ROW * 0.1);
	drawRadio(page2, document.getElementById("no_smoke"), OCCUPANCY + STARTX * 0.775, D - ROW * 0.65);
	drawRadio(page2, document.getElementById("yes_smoke"), LEAVE_REASON + STARTX * 0.225, D - ROW * 0.65);
	drawRadio(page2, document.getElementById("yes_insurance"), LEAVE_REASON + STARTX * 2.625, D - ROW * 1.75);
	drawRadio(page2, document.getElementById("no_insurance"), LEAVE_REASON + STARTX * 4, D - ROW * 1.75);
	//H
	drawRadio(page3, document.getElementById("yes_photoID1"), WIDTH * 3 / 4 + STARTX * 0.2, H - ROW);
	drawRadio(page3, document.getElementById("no_photoID1"), WIDTH * 3 / 4 + STARTX * 1.3, H - ROW);
	//I
	drawRadio(page3, document.getElementById("yes_photoID2"), WIDTH * 3 / 4 + STARTX * 0.225, I - ROW);
	drawRadio(page3, document.getElementById("no_photoID2"), WIDTH * 3 / 4 + STARTX * 1.3, I - ROW); 

	// Add the first copied page
	pdfDoc.addPage(page1);
	pdfDoc.addPage(page2);
	pdfDoc.addPage(page3);

	// Serialize the PDFDocument to bytes (a Uint8Array)
	const pdfBytes = await pdfDoc.save();

	// Trigger the browser to download the PDF document
	blob = new Blob([pdfBytes], {type: 'application/pdf'});
	const url = window.URL.createObjectURL(blob);
	//window.open(url, "newPdf.pdf", "height=700, width=700");
	console.log("Text written");
}