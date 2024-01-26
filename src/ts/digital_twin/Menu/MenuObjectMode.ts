import { Menu } from './Menu';

export class MenuObjectMode extends Menu{

    public domElement: any;
	public boundOnMouseDown: (evt: any) => void;
    public boundOnMouseUp: (evt: any) => void;
    
    constructor(domElement: HTMLElement) {
        super(null, 'menuBottom', ["menu_click", "menu_rotate"], "click");
        this.domElement = domElement;

        this.domElement.addEventListener('mousedown', () => this.onMouseDown(), false);
        this.domElement.addEventListener('mouseup', () => this.onMouseUp(), false);
        // this.domElement.addEventListener('keydown', () => this.onKeyDown(), false);
    }

    public executeNewStatus(newStatus: string): void{
        if(newStatus === 'rotate'){
            this.domElement.style.cursor = 'grab';
        }
    }

    public onMouseDown(): void{
        if(this.getStatus() === "rotate"){
            this.domElement.style.cursor = 'grabbing';
        }
    }

    public onMouseUp(): void{
        this.domElement.style.cursor = 'grab';
    }

    
	// public onKeyDown(): void{
	// 	console.log('onKeyDown')
	// }



  }