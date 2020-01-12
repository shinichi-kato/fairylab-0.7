export default class Part {
	constructor(dict){
		this.name=dict.name || '';
		this.availability = dict.availability;
		this.triggerLevel = dict.triggerLevel;
		this.retention = dict.retention;
		this.dict = typeof dict.dict === "string" ?
			JSON.parse(dict.dict) : dict.dict;
		console.log("dict=",this.dict)
	}
}