
// ********************* globais *********************
let gramatic = { entry: "", stack: "S"};
let init = true;
let next = true;
let invertShot = "";
let it = 0;
let countLetters = 0;
// Gramatica
posibilityS = {
	0 : "aAb",
	1 : "bB",
	weight : 2
}
posibilityA = {
	0 : "bCc",
	weight : 1
}
posibilityB = {
	0 : "aCb",
	1 : "cSb",
	2 : "",
	weight : 3
}
posibilityC = {
	0 : "aA",
	1 : "c",
	weight : 2
}
posibility = {
	"S" : posibilityS,
	"A" : posibilityA,
	"B" : posibilityB,
	"C" : posibilityC
}
// ****************** final globais ****************** 
// ********************* funçoes *********************
// inverte sentença na açao
const invert = (shot) => (invertShot = shot.split("").reverse().join(""));
// testa se a letra é maiuscula
const testingUpperCase = (letter) => (letter === letter.toUpperCase());
// troca de letra se for maiuscula
const swap = (x) => {
	for (var i = 0; i < x.length; i++){
		if (testingUpperCase(x[i])){
			return true;
		}
	}
	return false;
}
// mostra sentenca a ser executada
const setVeredict = () => {
	let veredict = "";
	for(let i = 0; i < gramatic.entry.length; i++){
		veredict = `<li id='letter-${i}'><a>${gramatic.entry[i]}</a></li>`;
		$('#stack-pagination').append(veredict);
	}
}
// executa automaticamente
const automatic = () => {
	if(init){
		gramatic.entry = $('#entry-point').val();
		setVeredict();
		init = false;
	}
	execut();
	next && setTimeout(automatic,400);
}
// sorteia a letra
const sortLetter = (c) => {
	let letter = random(posibility[c].weight);
	return posibility[c][letter];
}
// calculo da sorte
const random = (x) => {
	var result = Math.floor(Math.random() * x);
	return result;
}
// reinicia simulaçao e limpa tabela
const clear = () => {
	$('#entry-point').val('');
	$('#stack-table').find("tr").remove();
	$('#stack-pagination').find("li").remove();
	$('#div-magic').css("display", "none");
	gramatic = { entry: "", stack: "S"};
	init = true;
	next = true;
	invertShot = "";
	it = 0;
	countLetters = 0;
};
// normaliza a sentença
const normalizeVeredict = (veredict) => {
	let result = "";
	for (var i = 0; i < veredict.length; i++){
		var c = veredict[i];
		if (testingUpperCase(c)){
			let temp = sortLetter(c);
			result = result + temp;
		}else{
			result = result + c;
		}
	}
	return result;
}
//executa a analise sintatica
const execut = () => {
	if (next){
		let endStack = gramatic.stack[gramatic.stack.length-1];
		let entryPoint = gramatic.entry[0];
		let html = `<tr> <td>$${gramatic.stack}</td> <td>$${gramatic.entry}</td>`;
		it++;
		if(endStack == entryPoint){
			gramatic.stack = gramatic.stack.substring(0, gramatic.stack.length-1);
			gramatic.entry = gramatic.entry.substring(1, gramatic.entry.length);
			if(entryPoint != null && endStack != null){
				html += `<td>Desempilha e lê ${entryPoint}</td> </tr>`;
				$(`#letter-${countLetters} a`).addClass('letter-select');
				countLetters++;
			}else{
				html += `<td>Aceita a sentença em ${it} iterações.</td> </tr>`;
				next = false;
			}
		}else{
			let shot = endStack + entryPoint;
			if(shot !== null){
				let textShot= $(`#${shot}`).text();
				if (textShot.length == 0){
					html += `<td> Ocorre erro em ${it} iterações.</td> </tr>`;
					$(`#letter-${countLetters} a`).addClass('letter-select-error');
					countLetters++;
					next = false;
				}else{
					let shotSplit = textShot.split("->")
					if (shotSplit.length == 2){
						let ok = shotSplit[1];
						invert(ok);
						if ("E" == invertShot){
							invertShot = "";
						}
						gramatic.stack = gramatic.stack.substring(0, gramatic.stack.length-1);
						gramatic.stack = gramatic.stack + invertShot;
						html += `<td>${textShot}</td> </tr>`;

					}else{
						$(`#letter-${countLetters} a`).addClass('letter-select-error');
					}
				}
			}else{
				$(`#letter-${countLetters} a`).addClass('letter-select-error');
			}
		}
		$("#stack-table").append(html);
	}
	scrollPage();
}
// ****************** final funçoes ****************** 
// *********************botões **********************
// limpa os campos
$('#bt-clear').click(clear);
// gera sentença
$('#bt-generate').click(() => {
	clear();
	let veredict = "S";
	while(swap(veredict)){
		$('#entry-point').val(veredict);
		veredict = normalizeVeredict(veredict);
	}
	$('#entry-point').val(veredict);
	$('#div-magic').css("display", "block");
});
// executa a sentença
$('#bt-auto-complete').click(automatic);
// executa passo a passo
$('#bt-enter').click(() => {
	if(init){
		gramatic.entry = $('#entry-point').val();
		setVeredict();
		init = false;
	}
	execut();
});

$('#entry-point').keyup((event) => {
	if(event.target.value !== ''){
		$('#div-magic').css("display", "block");
	}else {
		$('#div-magic').css("display", "none");
	}
});


// ****************** final botões ****************** 

// inicializa o dropdow
$(() => $('.dropdown-toggle').dropdown()); 
const scrollPage = () => {
	let target_offset = $('#bt-enter').offset();
	let target_top = target_offset.top;
	$('html, body').animate({ scrollTop: target_top }, 50);
}