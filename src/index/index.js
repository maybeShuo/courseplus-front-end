import React from 'react';
import {render} from 'react-dom';

import AnalysisUtil from "../base/util/AnlaysisUtil";
import App from './containers/App';



function run()
{
    AnalysisUtil.createBdAnalysisEntry();
    render(
        <App />,
        document.getElementById("root")
    );
}

run();
