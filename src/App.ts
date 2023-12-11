import { Ticker } from "cookware";
import { TheatersManager } from "pancake";
import '../scss/css.scss';
import { MainReact } from "./MainReactView";
import { MainThree } from "./MainThree";
import { CamerasManager } from "./managers/CamerasManager";
// import Stats from 'stats.js';
import { InitCommands } from "./inits/InitCommands";

export class App {
    // private static _Stats : Stats;

    public static Init() {

            // this._Stats = new Stats();
            // this._Stats.showPanel(0);
            // document.body.appendChild(this._Stats.dom);
            InitCommands.Execute().then(() => {
                this._Start();
            })  
            
            
            //this._Start();
    }

    private static _Start() {
        CamerasManager.Init();
        MainThree.Init();
        MainReact.Init();
        // Ticker.SetFPS(60);
        // Ticker.SetFPS(30);
        Ticker.SetFPS(Infinity);
        Ticker.Start();
        Ticker.Add(this._Update);
    }

    private static _Update = (dt:number) => {
        // this._Stats.update();
    } 

    
}

App.Init();