export declare class GenerateHTML {
    renderer: THREE.WebGLRenderer;
    popUpSetting: (evt: any) => void;
    constructor(renderer: THREE.WebGLRenderer);
    private generateHTML;
    private loadSettings;
    private settingOnClick;
    popUpSettingFunction(): void;
}
