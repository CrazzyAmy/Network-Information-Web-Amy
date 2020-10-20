import * as THREE from '../node_modules/three/build/three.module.js';
import * as THelper from './three_helper.js';
export{Scenario, Trace};
class MultiScenario
{
    constructor(scenarios)
    {
        this.scenarios = scenarios;
        this.scenario_id = 0;
    }
}

class Scenario
{
    constructor(traces)
    {
        this.traces = traces;
        this.ready = false;
        this.parab_list = [];
    }
}

class Trace
{
    constructor(site_from, site_to)
    {
        this.site_from = site_from;
        this.site_to = site_to;
    }
}