export class MenuSearchARoom {

    private option: any;

    constructor() {
        this.option = '';
    }

    public setupLoadOption(option: any): void{
        this.option = option;
    }

    public setOption(floor: String): void{
        document.getElementById('selected_room_search').innerHTML = '<option value="" selected="selected">Choose a room</option>' + this.option[<string>floor];
    }

  }