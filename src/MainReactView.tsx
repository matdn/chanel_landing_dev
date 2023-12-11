import React from "react";
import ReactDOM, { Root } from 'react-dom/client';
import WaveView from "./views/reacts/WaveView";


export class MainReact {

    private static _Root: Root;

    public static Init() {
        this._Root = ReactDOM.createRoot(document.querySelector('.react') as HTMLElement);
        this._Root.render(
            <>
                <WaveView/>
            </>
        );
    }
}

