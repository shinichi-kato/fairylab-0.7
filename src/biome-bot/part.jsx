export default class Part {
	constructor(dict){
		this.name=dict.name || '';
		this.availability = dict.availability;
		this.triggerLevel = dict.triggerLevel;
		this.retention = dict.retention;
		this.dict = [...dict.dict];
	}
}