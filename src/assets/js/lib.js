// lib.js

export function disabledElementId(eleId, value){
	console.log(`disabledElementId(${ eleId }, ${value})`); 
	let sintaxis ='disableElement(eleId string , value boolean)'

	// console.log('Id = ', Id, 'string:', is_string(Id) );
	if( eleId && !typeof(eleId) == 'string' ) { console.log(sintaxis+' => eleId'); return ''; }
	let elem = document.getElementById(eleId);
	console.dir(elem);
	if( !elem ){ 
		// console.log('disableElement (Element ='+eleId+'), not found.'); 
		return null; 
	}
	// console.dir(elem);  
	elem.disabled = value;     
	// element.classList.      
}
export function disabledForm(idForm, YesNo, ElementsForm){
    //  Habilita/Deshabilita (YesNo = boolean), todos los elementos del form () o una lista especifica (ElementsForm)
    // console.log('disabledForm('+idForm+')');
    // console.log('boolean: ', YesNo);
    if( !idForm || !YesNo ){
        console.log('disabledForm(idForm - String, YesNo - Boolean)');
        return null;
    }
    const objForm = document.getElementById(idForm).elements;
	if( !objForm ){ console.log('Form (Form ='+idForm+'), not found.'); return null; }
	console.log(objForm);
    // if( objForm.nodeName !== 'FORM' ){ console.log('Form = '+idForm+', no es un FORM'); return null;}
    // console.dir(objForm);
    if( !ElementsForm ){        // Todos los elementos del form
        for(let e=0; e < objForm.length ; e++){
            // console.log(objForm[e]);
            objForm[e].disabled = YesNo;
        }
    }else{  // Algunos elementos "array" del form 
        // console.log(typeof(ElementsForm));  // Array
        for(let e=0; e < ElementsForm.length ; e++){
            objForm[ElementsForm[e]].disabled = YesNo; 
        }        
    }

}


// export function disabledEle(Id, YesNo){ 

// }
export function idGenerator(Id, lenghtId){
	let sintaxis ='idGenerator(Id string [, lenghtId integer])'
	let len = 0;
	let value = 0;
	let newId = '';
	console.log('---------');
	console.log('Id = ', Id, 'string:', is_string(Id) );

	console.log('lenghtId', lenghtId, 'number:', typeof(lenghtId));

	if( !is_string(Id) || !Id ) { console.log(sintaxis+' => Id'); return ''; }

	if( lenghtId && !is_number(lenghtId) ) { console.log(sintaxis+' => lenghtId'); return ''; }
	len = Id.trim().length;
	console.log('1. len = ', len);
	len = ( len == 0 && !lenghtId )? 1: lenghtId;
	console.log('2. len = ', len);
	value = parseInt(Id, 10)+1;
	newId = '0'.repeat(len)+value.toString()
	newId = newId.substr(len*-1);

	return newId;
}
export class Ordenar {
    /// Definicion de propiedades publicas
    // prop1 = ;
    // prop2;

    /// Constructor
// constructor(prop1){
//     // this.
// }
    /// Lectura (get())
    // get algo(){}

    /// Metodos
    //metodo1(){}
    
}

export function setNumero2dec(event){
	console.dir(event);
	this.value = parseFloat(this.value).toFixed(2);
}
// -------------------------------------------
function is_string(s) { return typeof(s) == 'string'; }			// true-false
function is_number(n) { return typeof(n) == 'number'; }			// true-false