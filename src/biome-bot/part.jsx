export default class Part {
	constructor(dict){
		this.name=dict.name || '';
		this.availability = dict.availability;
		this.sensitivity = dict.sensitivity;
		this.retention = dict.retention;
		this.dict = dict.dictSource;
		console.log("dict=",this.dict)
	}
}